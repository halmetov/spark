import { Book } from '@/types/database';
import { BookCard } from './BookCard';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  loading?: boolean;
}

export function BookGrid({ books, loading }: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-display text-xl text-foreground mb-2">No books found</h3>
        <p className="text-muted-foreground">Check back later for new additions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
