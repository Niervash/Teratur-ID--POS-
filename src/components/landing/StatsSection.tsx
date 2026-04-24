import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, PieChart, Users } from 'lucide-react';

const stats = [
  { value: '70%', label: 'Rata-rata Margin', description: 'yang dicapai pengguna kami', icon: TrendingUp },
  { value: '500+', label: 'UMKM Aktif', description: 'menggunakan TERATUR.ID', icon: Users },
  { value: 'Rp 40M+', label: 'Revenue Terkelola', description: 'per bulan rata-rata', icon: PieChart },
  { value: '10rb+', label: 'Transaksi/Bulan', description: 'terproses dengan lancar', icon: ShoppingCart },
];

export const StatsSection = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />
      <div className="container mx-auto max-w-6xl relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 sm:p-8 rounded-2xl bg-card/40 border border-border/30 hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gradient-primary number-display mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-foreground mb-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
