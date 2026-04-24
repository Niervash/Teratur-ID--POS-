import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { transactions } from '@/data/mockData';

export const RecentActivity = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const recent = transactions.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Aktivitas Terbaru</h3>
          <p className="text-sm text-muted-foreground">Transaksi terakhir</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="space-y-3">
        {recent.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              tx.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {tx.type === 'income' ? (
                <ArrowUpRight className="w-5 h-5 text-success" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-destructive" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{tx.category} • {tx.date}</p>
            </div>

            <div className="text-right">
              <p className={`text-sm font-semibold number-display ${
                tx.type === 'income' ? 'text-success' : 'text-destructive'
              }`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.total)}
              </p>
              <p className="text-xs text-muted-foreground">{tx.quantity} item</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
