import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Fitur', href: '#features' },
    { label: 'Cara Kerja', href: '#how-it-works' },
    { label: 'Testimoni', href: '#testimonials' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-background/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/Teratur_logo.png" alt="Teratur Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-primary font-brand">TERATUR.ID</span>
              <span className="text-[10px] text-muted-foreground leading-none hidden sm:block uppercase tracking-wider">Smart Management</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card/50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm font-semibold">
                Masuk
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-bold">
                Mulai Gratis
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <div className="pl-2 border-l border-border/50 h-8 flex items-center">
              <ThemeToggle large />
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-border/50 px-4 pb-6 pt-2"
        >
          <div className="flex justify-end mb-2">
            <ThemeToggle />
          </div>
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-card/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full">Masuk</Button>
            </Link>
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                Mulai Gratis <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
