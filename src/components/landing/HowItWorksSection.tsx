import { motion } from 'framer-motion';
import { ClipboardList, Calculator, LineChart, Rocket } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Input Produk & Resep',
    description: 'Masukkan data produk, bahan baku, dan resep. Sistem akan menghitung HPP per unit secara otomatis.',
  },
  {
    icon: Calculator,
    step: '02',
    title: 'Hitung HPP Otomatis',
    description: 'TERATUR.ID menghitung BBB + BTKL + BOP untuk setiap produk. Tidak perlu spreadsheet manual lagi.',
  },
  {
    icon: LineChart,
    step: '03',
    title: 'Catat Transaksi',
    description: 'Gunakan POS untuk catat penjualan. Setiap transaksi langsung terhubung ke kalkulasi profit.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Analisis & Grow',
    description: 'Lihat laporan, identifikasi produk paling profitable, dan buat keputusan bisnis berbasis data.',
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-primary mb-3 uppercase tracking-[0.2em]">
            Cara Kerja
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Mulai dalam <span className="text-gradient-primary">4 Langkah</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Setup bisnis Anda dalam hitungan menit, bukan minggu.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center group"
            >
              {/* Step number circle */}
              <div className="relative mx-auto mb-6">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mx-auto group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                  {step.step}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
