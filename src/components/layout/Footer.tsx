import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Linkedin } from 'lucide-react';
import sparkLogo from '@/assets/spark-logo.jpg';
const socialLinks = [{
  icon: Twitter,
  href: '#',
  label: 'Twitter'
}, {
  icon: Instagram,
  href: '#',
  label: 'Instagram'
}, {
  icon: Github,
  href: '#',
  label: 'GitHub'
}, {
  icon: Linkedin,
  href: '#',
  label: 'LinkedIn'
}];
const footerLinks = {
  Platform: [{
    label: 'Books',
    href: '/books'
  }, {
    label: 'Genres',
    href: '/genres'
  }, {
    label: 'Our Team',
    href: '/team'
  }],
  Company: [{
    label: 'About',
    href: '/about'
  }, {
    label: 'Contact',
    href: '/contact'
  }, {
    label: 'Careers',
    href: '#'
  }],
  Legal: [{
    label: 'Privacy',
    href: '#'
  }, {
    label: 'Terms',
    href: '#'
  }, {
    label: 'Cookies',
    href: '#'
  }]
};
export function Footer() {
  return <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <img src={sparkLogo} alt="The Spark League Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Discover a world of stories. Read online, explore genres, and ignite your imagination with The Spark League.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(social => <a key={social.label} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center
                           text-muted-foreground hover:text-primary hover:border-primary hover:scale-110
                           transition-all duration-300">
                  <social.icon className="w-5 h-5" />
                </a>)}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => <div key={title}>
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => <li key={link.label}>
                    <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>)}
              </ul>
            </div>)}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Spark league. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with love for book lovers everywhere.
          </p>
        </div>
      </div>
    </footer>;
}