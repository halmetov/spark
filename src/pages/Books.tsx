import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BookGrid } from '@/components/books/BookGrid';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: books = [], isLoading } = useBooks(categoryFilter || undefined);
  const { data: categories = [] } = useCategories();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCategory = categories.find((c) => c.id === categoryFilter);

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-spark-ice/50 to-background">
        {/* Header */}
        <section className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="font-display text-5xl font-bold text-foreground mb-4 animate-fade-up">
                Our Library
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '100ms' }}>
                Explore our collection of books and find your next great read.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-2xl border-border bg-card/80 backdrop-blur"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <button
                onClick={() => setSearchParams({})}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  !categoryFilter
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary hover:text-primary"
                )}
              >
                All Books
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSearchParams({ category: category.id })}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                    categoryFilter === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Active Filters */}
            {(activeCategory || searchQuery) && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>Filters:</span>
                </div>
                {activeCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {activeCategory.name}
                    <button onClick={() => setSearchParams({})} className="hover:text-primary/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-primary/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Books Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <BookGrid books={filteredBooks} loading={isLoading} />
          </div>
        </section>
      </div>
    </Layout>
  );
}
