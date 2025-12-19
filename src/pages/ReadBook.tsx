import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useBook } from '@/hooks/useBooks';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReadBook() {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading } = useBook(id || '');

  if (isLoading) {
    return (
      <Layout hideFooter>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-center">
            <BookOpen className="w-12 h-12 text-primary/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading book...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Book Not Found</h1>
            <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
            <Link to="/books">
              <Button className="btn-primary gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Library
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Strip HTML tags for word count
  const plainText = book.content?.replace(/<[^>]*>/g, ' ') || '';
  const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Check if content is HTML
  const isHtmlContent = book.content?.includes('<') && book.content?.includes('>');

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-background">
        {/* Reading Header */}
        <header className="sticky top-16 z-40 glass border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/books">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="font-display text-lg font-semibold text-foreground line-clamp-1">
                    {book.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="hidden sm:flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </span>
                {book.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {book.category.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Book Content */}
        <main className="py-12">
          <article className="container mx-auto px-4 max-w-3xl">
            {/* Book Header */}
            <div className="text-center mb-12 pb-12 border-b border-border">
              {book.cover_image && (
                <div className="w-48 h-64 mx-auto mb-8 rounded-xl overflow-hidden shadow-elevated">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {book.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
                <User className="w-5 h-5" />
                <span>{book.author}</span>
              </div>
              {book.description && (
                <p className="mt-6 text-muted-foreground max-w-xl mx-auto italic">
                  {book.description}
                </p>
              )}
            </div>

            {/* Book Text Content */}
            <div className="prose prose-lg max-w-none">
              {book.content ? (
                isHtmlContent ? (
                  <div 
                    className="book-content text-foreground leading-relaxed"
                    style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', lineHeight: '1.8' }}
                    dangerouslySetInnerHTML={{ __html: book.content }}
                  />
                ) : (
                  <div 
                    className="text-foreground leading-relaxed space-y-6"
                    style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', lineHeight: '1.8' }}
                  >
                    {book.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-foreground/90">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Content for this book is not available yet.
                  </p>
                </div>
              )}
            </div>

            {/* End of Book */}
            <div className="mt-16 pt-12 border-t border-border text-center">
              <p className="text-muted-foreground mb-6">— The End —</p>
              <Link to="/books">
                <Button className="btn-primary gap-2">
                  <BookOpen className="w-4 h-4" />
                  Explore More Books
                </Button>
              </Link>
            </div>
          </article>
        </main>
      </div>
    </Layout>
  );
}
