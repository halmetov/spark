import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, BookOpen, Upload, FileText, Type, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Book } from '@/types/database';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function BooksManager() {
  const { data: books = [], isLoading } = useBooks();
  const { data: categories = [] } = useCategories();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    content: '',
    cover_image: '',
    category_id: '',
  });
  const [uploading, setUploading] = useState(false);
  const [contentMode, setContentMode] = useState<'text' | 'pdf'>('text');
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      content: '',
      cover_image: '',
      category_id: '',
    });
    setEditingBook(null);
    setContentMode('text');
    setExtractedText('');
    setShowPreview(false);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      content: book.content || '',
      cover_image: book.cover_image || '',
      category_id: book.category_id || '',
    });
    setContentMode('text');
    setExtractedText('');
    setShowPreview(false);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `book-covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    setFormData((prev) => ({ ...prev, cover_image: publicUrl }));
    setUploading(false);
    toast.success('Image uploaded');
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setExtractingPdf(true);
    setExtractedText('');
    setShowPreview(false);

    try {
      const formDataObj = new FormData();
      formDataObj.append('pdf', file);

      const { data, error } = await supabase.functions.invoke('extract-pdf-text', {
        body: formDataObj,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract text');
      }

      setExtractedText(data.text);
      setShowPreview(true);
      toast.success(`Extracted ${data.charCount} characters from PDF`);
    } catch (error) {
      console.error('PDF extraction error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to extract text from PDF');
    } finally {
      setExtractingPdf(false);
    }
  };

  const applyExtractedText = () => {
    // Convert plain text to HTML paragraphs for the rich text editor
    const htmlContent = extractedText
      .split('\n\n')
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
    
    setFormData((prev) => ({ ...prev, content: htmlContent }));
    setShowPreview(false);
    setContentMode('text');
    toast.success('Text applied to content editor');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookData = {
      title: formData.title,
      author: formData.author,
      description: formData.description || null,
      content: formData.content || null,
      cover_image: formData.cover_image || null,
      category_id: formData.category_id || null,
    };

    try {
      if (editingBook) {
        await updateBook.mutateAsync({ id: editingBook.id, ...bookData });
        toast.success('Book updated');
      } else {
        await createBook.mutateAsync(bookData);
        toast.success('Book created');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save book');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook.mutateAsync(id);
      toast.success('Book deleted');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Books</h1>
            <p className="text-muted-foreground mt-1">Manage your book collection.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="btn-primary gap-2">
                <Plus className="w-4 h-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((p) => ({ ...p, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                  />
                </div>

                {/* Book Content Section */}
                <div className="space-y-4">
                  <Label>Book Content</Label>
                  
                  <Tabs value={contentMode} onValueChange={(v) => setContentMode(v as 'text' | 'pdf')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text" className="gap-2">
                        <Type className="w-4 h-4" />
                        Write Text
                      </TabsTrigger>
                      <TabsTrigger value="pdf" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Upload PDF
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="mt-4">
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData((p) => ({ ...p, content }))}
                        placeholder="Enter the book content here..."
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Use the toolbar to format text with headings, bold, italic, and lists.
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="pdf" className="mt-4 space-y-4">
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                        {extractingPdf ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-muted-foreground">Extracting text from PDF...</p>
                          </div>
                        ) : (
                          <label className="cursor-pointer block">
                            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-foreground font-medium mb-1">Upload PDF to extract text</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              The PDF will be processed and text will be extracted. The PDF file will NOT be stored.
                            </p>
                            <Button type="button" variant="outline" className="gap-2">
                              <Upload className="w-4 h-4" />
                              Select PDF File
                            </Button>
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              className="hidden"
                              onChange={handlePdfUpload}
                              disabled={extractingPdf}
                            />
                          </label>
                        )}
                      </div>
                      
                      {/* Preview extracted text */}
                      {showPreview && extractedText && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Extracted Text Preview</Label>
                            <Button
                              type="button"
                              size="sm"
                              onClick={applyExtractedText}
                              className="gap-2"
                            >
                              <Type className="w-4 h-4" />
                              Apply to Editor
                            </Button>
                          </div>
                          <div className="border border-border rounded-lg p-4 max-h-[300px] overflow-y-auto bg-secondary/30">
                            <Textarea
                              value={extractedText}
                              onChange={(e) => setExtractedText(e.target.value)}
                              rows={10}
                              className="min-h-[200px] resize-none"
                              placeholder="Extracted text will appear here..."
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            You can edit the extracted text before applying it. Click "Apply to Editor" to use this content.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="flex items-center gap-4">
                    {formData.cover_image && (
                      <img
                        src={formData.cover_image}
                        alt="Cover preview"
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                    )}
                    <label className="flex-1">
                      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {uploading ? 'Uploading...' : 'Click to upload cover image'}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={createBook.isPending || updateBook.isPending}>
                    {editingBook ? 'Save Changes' : 'Add Book'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Books Table */}
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading books...</div>
            </div>
          ) : books.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No books yet. Add your first book!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Book</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Author</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {book.cover_image ? (
                            <img
                              src={book.cover_image}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{book.title}</p>
                            {book.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">{book.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{book.author}</td>
                      <td className="py-4 px-6">
                        {book.category ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {book.category.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(book)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{book.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(book.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
