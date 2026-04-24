import { motion } from 'framer-motion';
import { Calculator, Users, BarChart3, ShoppingCart, Layers, Shield } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Kalkulasi HPP Real-time',
    description: 'Hitung biaya produksi per unit secara otomatis berdasarkan resep, bahan baku, tenaga kerja, dan overhead.',
    color: 'from-primary/20 to-primary/5',
  },
  {
    icon: Users,
    title: 'Manajemen Karyawan',
    description: 'Kelola data karyawan dengan kategorisasi BTKL untuk perhitungan HPP yang akurat dan transparan.',
    color: 'from-accent/20 to-accent/5',
  },
  {
    icon: BarChart3,
    title: 'Laporan Eksekutif',
    description: 'Dashboard dengan analisis laba rugi, margin, tren penjualan, dan breakdown biaya yang detail.',
    color: 'from-warning/20 to-warning/5',
  },
  {
    icon: ShoppingCart,
    title: 'Sistem POS Terintegrasi',
    description: 'Catat transaksi penjualan dengan mudah. Lihat profit per transaksi secara real-time.',
    color: 'from-primary/20 to-primary/5',
  },
  {
    icon: Layers,
    title: 'Multi-Produk & Resep',
    description: 'Kelola unlimited produk dengan resep berbeda. Setiap produk memiliki kalkulasi HPP tersendiri.',
    color: 'from-accent/20 to-accent/5',
  },
  {
    icon: Shield,
    title: 'Keamanan Data',
    description: 'Data bisnis Anda terenkripsi dan aman. Akses berbasis role: Manager dan Cashier.',
    color: 'from-warning/20 to-warning/5',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-card/20 pointer-events-none" />
      <div className="container mx-auto max-w-6xl relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-primary mb-3 uppercase tracking-[0.2em]">
            Fitur Unggulan
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Semua yang Anda Butuhkan,
            <br />
            <span className="text-gradient-primary">dalam Satu Platform</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Tools lengkap untuk mengelola HPP, keuangan, dan operasional bisnis kuliner Anda.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative p-6 sm:p-8 rounded-2xl border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-foreground" />
              </div>

              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
