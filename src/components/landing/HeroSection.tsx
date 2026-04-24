import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'Kalkulasi HPP otomatis',
  'Tracking margin real-time',
  'Laporan keuangan profesional',
  'Multi-role access control',
];

export const HeroSection = () => {
  return (
    <section className="relative pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-primary/4 rounded-full blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Platform HPP & Keuangan #1 di Indonesia</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.2] sm:leading-[1.1] tracking-tight mb-6"
          >
            Kelola{' '}
            <span className="text-gradient-primary">Biaya Produksi</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            dengan Presisi
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed px-2"
          >
            Hitung HPP per gram, per unit, per produk. Pahami ke mana setiap rupiah Anda mengalir — dari bahan baku hingga profit margin.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10"
          >
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-8 text-base font-semibold gap-2.5 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                Mulai Gratis — Tanpa Kartu Kredit
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-13 px-8 text-base gap-2.5 border-border/60 hover:bg-card hover:border-border"
            >
              <Play className="w-4 h-4" />
              Tonton Demo
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-xs text-muted-foreground/60"
          >
            Dipercaya oleh 500+ UMKM di seluruh Indonesia
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 sm:mt-20 relative group"
        >
          {/* Glow behind */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

          <div className="relative glass-card p-1.5 sm:p-2 rounded-2xl shadow-2xl border border-primary/15 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                  app.teratur.id/dashboard
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-card to-background rounded-b-xl p-6 sm:p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: 'Rp 40.4M', change: '+12.5%', positive: true },
                  { label: 'Total HPP', value: 'Rp 12.1M', change: '-8.2%', positive: false },
                  { label: 'Gross Margin', value: '70.0%', change: '+3.1%', positive: true },
                  { label: 'Transaksi', value: '524', change: '+24', positive: true },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="p-4 sm:p-5 rounded-xl bg-secondary/30 border border-border/30"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-xl sm:text-2xl font-bold number-display">{item.value}</p>
                    <p className={`text-xs mt-1 ${item.positive ? 'text-success' : 'text-destructive'}`}>
                      {item.change}
                    </p>
                  </motion.div>
                ))}
              </div>
              {/* Chart placeholder */}
              <div className="mt-6 h-32 sm:h-40 rounded-xl bg-secondary/20 border border-border/20 flex items-end justify-center gap-1 p-4">
                {[40, 55, 45, 65, 58, 75, 70, 80, 72, 85, 78, 90].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + i * 0.05, duration: 0.4 }}
                    className="flex-1 bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-sm min-w-[4px]"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
