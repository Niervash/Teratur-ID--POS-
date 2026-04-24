import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-primary/20"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-accent/10" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

          <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-8">
              <Zap className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
              Siap Mengelola HPP
              <br />
              <span className="text-gradient-primary">dengan Lebih Cerdas?</span>
            </h2>

            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-base sm:text-lg">
              Bergabung dengan ratusan UMKM yang sudah mengoptimalkan margin keuntungan mereka dengan TERATUR.ID.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base font-semibold gap-2.5 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25"
                >
                  Mulai Gratis Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground/60">
              Gratis selamanya untuk 1 bisnis • Tidak perlu kartu kredit
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
