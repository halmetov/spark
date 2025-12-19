import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Book } from '@/types/database';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <div
      className={cn(
        "group glass-card overflow-hidden hover-lift",
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-spark-lavender to-spark-ice">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Read button on hover */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 
                      group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Link to={`/read/${book.id}`}>
            <Button className="w-full btn-primary gap-2">
              <BookOpen className="w-4 h-4" />
              Read Online
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {book.category && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {book.category.name}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold mt-2 text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        {book.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {book.description}
          </p>
        )}
      </div>
    </div>
  );
}
