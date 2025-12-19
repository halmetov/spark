import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCategories } from '@/hooks/useCategories';
import { useBooks } from '@/hooks/useBooks';
import { BookOpen, ArrowRight } from 'lucide-react';

const genreColors = [
  'from-blue-500/20 to-indigo-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-cyan-500/20 to-blue-500/20',
  'from-rose-500/20 to-purple-500/20',
];

export default function Genres() {
  const { data: categories = [], isLoading } = useCategories();
  const { data: books = [] } = useBooks();

  const getCategoryBookCount = (categoryId: string) => {
    return books.filter((book) => book.category_id === categoryId).length;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-12 bg-muted rounded-lg w-48 mx-auto mb-4 animate-pulse" />
              <div className="h-6 bg-muted rounded-lg w-96 mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-spark-lavender/30 to-background">
        {/* Header */}
        <section className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="font-display text-5xl font-bold text-foreground mb-4 animate-fade-up">
                Explore Genres
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '100ms' }}>
                Discover books across different categories and find stories that match your mood.
              </p>
            </div>
          </div>
        </section>

        {/* Genres Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            {categories.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl text-foreground mb-2">No genres yet</h3>
                <p className="text-muted-foreground">Check back later for new categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => {
                  const bookCount = getCategoryBookCount(category.id);
                  const colorClass = genreColors[index % genreColors.length];
                  
                  return (
                    <Link
                      key={category.id}
                      to={`/books?category=${category.id}`}
                      className="group glass-card p-8 hover-lift animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} 
                                    flex items-center justify-center mb-6 
                                    group-hover:scale-110 transition-transform duration-300`}>
                        <BookOpen className="w-8 h-8 text-primary" />
                      </div>
                      
                      <h3 className="font-display text-2xl font-bold text-foreground mb-2 
                                   group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      
                      {category.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {bookCount} {bookCount === 1 ? 'book' : 'books'}
                        </span>
                        <span className="flex items-center gap-1 text-primary opacity-0 
                                       group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">Explore</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
