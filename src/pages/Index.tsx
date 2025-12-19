import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SparkLogo3D } from '@/components/3d/SparkLogo';
import { BookGrid } from '@/components/books/BookGrid';
import { PartnersSection } from '@/components/partners/PartnersSection';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { ArrowRight, BookOpen, Sparkles, Users, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { data: categories = [] } = useCategories();

  const featuredBooks = books.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-spark-ice to-spark-lavender/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur border border-border mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Welcome to the future of reading</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Ignite Your
              <span className="block gradient-text">Imagination</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Discover thousands of books, explore new genres, and read online anytime, anywhere. Your next adventure awaits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Link to="/books">
                <Button className="btn-primary gap-2 text-lg px-8 py-6">
                  <BookOpen className="w-5 h-5" />
                  Browse Books
                </Button>
              </Link>
              <Link to="/genres">
                <Button variant="outline" className="btn-secondary gap-2 text-lg px-8 py-6">
                  Explore Genres
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <SparkLogo3D />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Why Choose The Spark League?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience reading like never before with our modern platform designed for book lovers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Library,
                title: 'Vast Library',
                description: 'Access thousands of books across every genre imaginable.',
              },
              {
                icon: BookOpen,
                title: 'Read Anywhere',
                description: 'Enjoy your books online from any device, anytime.',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Join a community of passionate readers and discover new favorites.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-8 text-center hover-lift animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-2">
                Featured Books
              </h2>
              <p className="text-muted-foreground">
                Handpicked selections for your reading pleasure.
              </p>
            </div>
            <Link to="/books">
              <Button variant="outline" className="gap-2">
                View All Books
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <BookGrid books={featuredBooks} loading={booksLoading} />
        </div>
      </section>

      {/* Genres Preview */}
      {categories.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-spark-ice to-spark-lavender/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Explore Genres
              </h2>
              <p className="text-muted-foreground">
                Find your next read by exploring our curated categories.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.slice(0, 8).map((category, index) => (
                <Link
                  key={category.id}
                  to={`/books?category=${category.id}`}
                  className="px-6 py-3 rounded-full bg-card border border-border hover:border-primary 
                           hover:bg-primary/5 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-medium text-foreground">{category.name}</span>
                </Link>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/genres">
                <Button className="btn-primary gap-2">
                  View All Genres
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      <PartnersSection />

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Ready to Start Reading?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Dive into our collection of books and discover stories that will captivate your imagination.
              </p>
              <Link to="/books">
                <Button className="btn-primary text-lg px-10 py-6 gap-2">
                  <BookOpen className="w-5 h-5" />
                  Start Reading Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
