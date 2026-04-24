import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Users, Zap, TrendingUp, Calculator } from 'lucide-react';
import { Product } from '@/data/mockData';
import { Button } from '@/components/ui/button';

interface ProductDetailCardProps {
  product: Product;
}

export const ProductDetailCard = ({ product }: ProductDetailCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const bbbTotal = product.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0);
  const totalHpp = bbbTotal + product.laborCost + product.overheadCost;

  const costBreakdown = [
    { label: 'BBB', value: bbbTotal, percentage: (bbbTotal / totalHpp) * 100, color: 'bg-primary' },
    { label: 'BTKL', value: product.laborCost, percentage: (product.laborCost / totalHpp) * 100, color: 'bg-accent' },
    { label: 'BOP', value: product.overheadCost, percentage: (product.overheadCost / totalHpp) * 100, color: 'bg-warning' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Product Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
              {product.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {product.salesCount} terjual bulan ini
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Harga Jual</p>
            <p className="text-2xl font-bold text-primary number-display">
              {formatCurrency(product.sellingPrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Recipe Breakdown */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h2 className="font-semibold">Recipe Breakdown</h2>
              <p className="text-sm text-muted-foreground">Biaya per gram bahan</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Subtotal BBB</p>
              <p className="font-semibold number-display">{formatCurrency(bbbTotal)}</p>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="rounded-xl overflow-hidden border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bahan</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Gramasi</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Harga/unit</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {product.ingredients.map((ingredient, index) => (
                    <motion.tr
                      key={ingredient.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="font-medium">{ingredient.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right number-display text-muted-foreground">
                        {ingredient.amount} {ingredient.unit}
                      </td>
                      <td className="py-3 px-4 text-right number-display text-muted-foreground">
                        {formatCurrency(ingredient.pricePerUnit)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold number-display">
                        {formatCurrency(ingredient.totalCost)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Progress bars for each ingredient */}
            <div className="mt-6 space-y-3">
              {product.ingredients.map((ingredient) => {
                const percentage = (ingredient.totalCost / bbbTotal) * 100;
                return (
                  <div key={ingredient.id} className="group">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{ingredient.name}</span>
                      <span className="number-display">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="progress-fill bg-gradient-to-r from-primary to-primary/60"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Production Costs */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">BTKL</p>
              <p className="font-semibold">Biaya Tenaga Kerja</p>
            </div>
          </div>
          <p className="text-2xl font-bold number-display text-accent">
            {formatCurrency(product.laborCost)}
            <span className="text-sm font-normal text-muted-foreground"> / cup</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">BOP</p>
              <p className="font-semibold">Overhead</p>
            </div>
          </div>
          <p className="text-2xl font-bold number-display text-warning">
            {formatCurrency(product.overheadCost)}
            <span className="text-sm font-normal text-muted-foreground"> / cup</span>
          </p>
        </motion.div>
      </div>

      {/* Cost Composition Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold mb-4">Komposisi Biaya</h3>
        
        <div className="h-8 rounded-full overflow-hidden flex bg-secondary mb-4">
          {costBreakdown.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              className={`${item.color} flex items-center justify-center`}
            >
              <span className="text-xs font-medium text-white">
                {item.percentage.toFixed(0)}%
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {costBreakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium number-display">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Final HPP Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8 text-center glow-primary"
      >
        <p className="text-sm text-muted-foreground mb-2">TOTAL HPP / CUP</p>
        <p className="text-5xl font-bold text-gradient-primary mb-4 number-display">
          {formatCurrency(totalHpp)}
        </p>
        
        <div className="flex items-center justify-center gap-8 mb-6">
          <div>
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="text-xl font-bold text-success number-display">{product.margin}%</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">Profit / Cup</p>
            <p className="text-xl font-bold text-success number-display">
              {formatCurrency(product.sellingPrice - totalHpp)}
            </p>
          </div>
        </div>

        <Button className="gap-2">
          <Calculator className="w-4 h-4" />
          Simulasi Harga Jual
        </Button>
      </motion.div>
    </motion.div>
  );
};
