import { Layout } from '@/components/layout/Layout';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { Users, User } from 'lucide-react';

export default function Team() {
  const { data: members = [], isLoading } = useTeamMembers();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-12 bg-muted rounded-lg w-48 mx-auto mb-4 animate-pulse" />
              <div className="h-6 bg-muted rounded-lg w-96 mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-spark-mint/30 to-background">
        {/* Header */}
        <section className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="font-display text-5xl font-bold text-foreground mb-4 animate-fade-up">
                Our Team
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '100ms' }}>
                Meet the passionate people behind Spark who work tirelessly to bring you the best reading experience.
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            {members.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl text-foreground mb-2">Team coming soon</h3>
                <p className="text-muted-foreground">Check back later to meet our team.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className="group glass-card p-8 text-center hover-lift animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Photo */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 
                                    rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-card 
                                    shadow-card group-hover:scale-105 transition-transform duration-300">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-spark-lavender to-spark-ice 
                                        flex items-center justify-center">
                            <User className="w-12 h-12 text-primary/50" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <h3 className="font-display text-xl font-bold text-foreground mb-1 
                                 group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
