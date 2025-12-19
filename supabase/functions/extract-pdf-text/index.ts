const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      console.error('No PDF file provided');
      return new Response(
        JSON.stringify({ success: false, error: 'No PDF file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing PDF:', file.name, 'Size:', file.size);

    // Read the file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Simple PDF text extraction
    // This extracts text from PDF by finding text streams
    let extractedText = '';
    
    // Convert to string for pattern matching
    const pdfString = new TextDecoder('latin1').decode(bytes);
    
    // Extract text between BT (begin text) and ET (end text) markers
    const textBlocks: string[] = [];
    let searchIndex = 0;
    
    while (searchIndex < pdfString.length) {
      const btIndex = pdfString.indexOf('BT', searchIndex);
      if (btIndex === -1) break;
      
      const etIndex = pdfString.indexOf('ET', btIndex);
      if (etIndex === -1) break;
      
      const block = pdfString.substring(btIndex, etIndex);
      
      // Extract text from Tj and TJ operators
      const tjMatches = block.match(/\(([^)]*)\)\s*Tj/g) || [];
      const tjArrayMatches = block.match(/\[([^\]]*)\]\s*TJ/g) || [];
      
      for (const match of tjMatches) {
        const text = match.match(/\(([^)]*)\)/)?.[1] || '';
        if (text.trim()) {
          textBlocks.push(decodeEscapedText(text));
        }
      }
      
      for (const match of tjArrayMatches) {
        const arrayContent = match.match(/\[([^\]]*)\]/)?.[1] || '';
        const textParts = arrayContent.match(/\(([^)]*)\)/g) || [];
        for (const part of textParts) {
          const text = part.match(/\(([^)]*)\)/)?.[1] || '';
          if (text.trim()) {
            textBlocks.push(decodeEscapedText(text));
          }
        }
      }
      
      searchIndex = etIndex + 2;
    }
    
    // Also try to extract from stream objects
    const streamMatches = pdfString.match(/stream\r?\n([\s\S]*?)\r?\nendstream/g) || [];
    for (const streamMatch of streamMatches) {
      const streamContent = streamMatch.replace(/^stream\r?\n/, '').replace(/\r?\nendstream$/, '');
      // Look for readable text patterns in streams
      const readableText = streamContent.match(/[\x20-\x7E]{4,}/g) || [];
      for (const text of readableText) {
        if (text.length > 10 && !text.includes('obj') && !text.includes('endobj')) {
          // Filter out PDF syntax
          if (!/^[0-9\s.]+$/.test(text) && !/^[A-Za-z]{1,2}\s*$/.test(text)) {
            textBlocks.push(text);
          }
        }
      }
    }
    
    extractedText = textBlocks
      .filter(t => t.trim().length > 0)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // If no text found with the above method, try alternative extraction
    if (!extractedText || extractedText.length < 50) {
      console.log('Trying alternative text extraction...');
      
      // Find all readable ASCII sequences
      const readableMatches = pdfString.match(/[\x20-\x7E]{10,}/g) || [];
      const filtered = readableMatches
        .filter(t => {
          // Filter out PDF syntax and binary patterns
          if (t.includes('/') && t.includes(' ')) return false;
          if (/^\d+\s+\d+\s+obj/.test(t)) return false;
          if (/endobj|endstream|xref|trailer/.test(t)) return false;
          if (/^[0-9.\s]+$/.test(t)) return false;
          return t.split(' ').some(word => word.length > 3);
        });
      
      if (filtered.length > 0) {
        extractedText = filtered.join('\n\n');
      }
    }

    if (!extractedText || extractedText.length < 20) {
      console.log('Could not extract meaningful text from PDF');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not extract text from this PDF. The PDF may be image-based or encrypted. Please try copying and pasting the text manually.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracted text length:', extractedText.length);
    
    // Format the text into paragraphs
    const formattedText = extractedText
      .split(/\.\s+/)
      .filter(s => s.trim().length > 0)
      .map(s => s.trim() + '.')
      .join('\n\n');

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: formattedText,
        charCount: formattedText.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to extract text from PDF' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function decodeEscapedText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}
