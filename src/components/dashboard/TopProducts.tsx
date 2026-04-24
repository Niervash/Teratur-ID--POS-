import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { products } from '@/data/mockData';
import { Link } from 'react-router-dom';

export const TopProducts = () => {
  const sortedProducts = [...products].sort((a, b) => b.margin - a.margin);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="p-6 rounded-2xl bg-card/40 border border-border/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Top Produk</h3>
          <p className="text-sm text-muted-foreground">Margin tertinggi</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Lihat Semua
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {sortedProducts.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
              {product.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.salesCount} terjual • {formatCurrency(product.sellingPrice)}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="w-3 h-3" />
                <span className="text-sm font-bold number-display">{product.margin.toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">margin</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
