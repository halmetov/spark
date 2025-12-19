import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink } from 'lucide-react';

const ADMIN_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const ADMIN_URL = `${ADMIN_BASE.replace(/\/$/, "")}/admin`;

export default function AdminInfo() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-spark-ice to-spark-lavender/30 px-4">
        <div className="glass-card max-w-2xl w-full p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Content is managed in Django Admin
            </h1>
            <p className="text-muted-foreground">
              The in-app admin panel has been replaced with Django Admin. Use the backend
              admin site to create, edit, or remove books, categories, partners, and team members.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary gap-2">
              <a href={ADMIN_URL} target="_blank" rel="noreferrer">
                Open Django Admin
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/books">Back to site</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
