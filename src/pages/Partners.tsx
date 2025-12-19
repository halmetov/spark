import { Layout } from '@/components/layout/Layout';
import { usePartners } from '@/hooks/usePartners';
import { Handshake, ExternalLink } from 'lucide-react';

export default function Partners() {
  const { data: partners = [], isLoading } = usePartners();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-spark-ice to-spark-lavender/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 animate-fade-up">
              <Handshake className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Our Partners
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: '200ms' }}>
              We collaborate with exceptional organizations to bring you the best reading experience. 
              Together, we're building a community of passionate readers.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-20">
              <Handshake className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Partners Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're building exciting partnerships. Check back soon to see our collaborators.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center max-w-3xl mx-auto">
            <Handshake className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Interested in Partnering?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join our network of partners and help us promote literacy and a love for reading.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium
                       hover:bg-primary/90 transition-colors duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

interface PartnerCardProps {
  partner: {
    id: string;
    name: string;
    logo: string | null;
    website_url: string | null;
  };
  index: number;
}

function PartnerCard({ partner, index }: PartnerCardProps) {
  const content = (
    <div
      className="group relative bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]
                 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30
                 hover:-translate-y-2 hover:scale-[1.02] animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Logo */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="max-w-full max-h-24 object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
            <Handshake className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </div>
        )}
      </div>

      {/* Partner Name */}
      <div className="relative z-10 mt-4 text-center">
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {partner.name}
        </h3>
        {partner.website_url && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Visit Website <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary/50 transition-colors duration-300" />
    </div>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
      >
        {content}
      </a>
    );
  }

  return content;
}
