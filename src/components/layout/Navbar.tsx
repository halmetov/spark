import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import sparkLogo from '@/assets/spark-logo.jpg';
const navLinks = [{
  href: '/',
  label: 'Home'
}, {
  href: '/books',
  label: 'Books'
}, {
  href: '/genres',
  label: 'Genres'
}, {
  href: '/partners',
  label: 'Our Partners'
}, {
  href: '/team',
  label: 'Our Team'
}, {
  href: '/contact',
  label: 'Contact'
}];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={sparkLogo} alt="Spark Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => <Link key={link.href} to={link.href} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200", location.pathname === link.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
                {link.label}
              </Link>)}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/books">
              <Button className="btn-primary gap-2">
                <BookOpen className="w-4 h-4" />
                Start Reading
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)} className={cn("px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200", location.pathname === link.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
                  {link.label}
                </Link>)}
              <Link to="/books" onClick={() => setIsOpen(false)}>
                <Button className="btn-primary w-full gap-2 mt-2">
                  <BookOpen className="w-4 h-4" />
                  Start Reading
                </Button>
              </Link>
            </div>
          </div>}
      </div>
    </nav>;
}