import { usePartners } from '@/hooks/usePartners';
import { Handshake } from 'lucide-react';

export function PartnersSection() {
  const { data: partners = [], isLoading } = usePartners();

  if (isLoading) {
    return (
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center animate-pulse">
            <div className="h-10 bg-muted rounded w-64 mx-auto mb-4" />
            <div className="h-5 bg-muted rounded w-96 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
            <Handshake className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Our Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading organizations to bring you the best reading experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>
      </div>
    </section>
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
      className="group relative bg-card border border-border rounded-2xl p-6 flex items-center justify-center h-32
                 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30
                 hover:-translate-y-1 hover:scale-[1.02] animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-w-full max-h-20 object-contain relative z-10 grayscale group-hover:grayscale-0 transition-all duration-300"
        />
      ) : (
        <div className="flex flex-col items-center justify-center relative z-10">
          <Handshake className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          <span className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {partner.name}
          </span>
        </div>
      )}

      {/* Partner name tooltip on hover */}
      {partner.logo && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground/90 text-background text-xs rounded-full
                       opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
          {partner.name}
        </div>
      )}
    </div>
  );

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}
