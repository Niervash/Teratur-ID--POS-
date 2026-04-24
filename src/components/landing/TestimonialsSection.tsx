import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rina Sari',
    role: 'Owner, Kopi Nusantara',
    content: 'Sebelum pakai TERATUR.ID, saya tidak tahu margin sebenarnya dari setiap produk. Sekarang saya bisa lihat mana produk yang paling profitable.',
    rating: 5,
  },
  {
    name: 'Ahmad Fauzi',
    role: 'Manager, Bakery House Jakarta',
    content: 'Perhitungan HPP yang tadinya butuh 2 jam di Excel, sekarang otomatis dan real-time. Tim saya lebih fokus ke operasional.',
    rating: 5,
  },
  {
    name: 'Diana Putri',
    role: 'CEO, Fresh Bowl Co.',
    content: 'Fitur laporan keuangannya sangat membantu saat meeting dengan investor. Data selalu up-to-date dan profesional.',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-card/20 pointer-events-none" />
      <div className="container mx-auto max-w-6xl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-primary mb-3 uppercase tracking-[0.2em]">
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Dipercaya oleh <span className="text-gradient-primary">Pebisnis Indonesia</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Lihat apa kata pengguna TERATUR.ID tentang pengalaman mereka.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative p-6 sm:p-8 rounded-2xl border border-border/30 bg-card/30 hover:border-primary/20 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
