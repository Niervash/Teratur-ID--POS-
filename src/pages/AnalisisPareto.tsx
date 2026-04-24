import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Area } from 'recharts';
import { products } from '@/data/mockData';

const AnalisisPareto = () => {
  // Sort products by revenue descending
  const sorted = [...products]
    .map(p => ({ name: p.name, revenue: p.sellingPrice * p.salesCount, salesCount: p.salesCount, emoji: p.emoji }))
    .sort((a, b) => b.revenue - a.revenue);

  const totalRevenue = sorted.reduce((sum, p) => sum + p.revenue, 0);

  // Calculate cumulative percentage
  let cumulative = 0;
  const paretoData = sorted.map(p => {
    cumulative += p.revenue;
    return {
      name: p.name,
      revenue: p.revenue,
      cumulativePercent: Math.round((cumulative / totalRevenue) * 100),
      emoji: p.emoji,
    };
  });

  // Find 80% threshold
  const threshold80 = paretoData.findIndex(d => d.cumulativePercent >= 80);
  const topProducts = paretoData.slice(0, threshold80 + 1);

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analisis Pareto (80/20)</h1>
          <p className="text-muted-foreground text-sm">Identifikasi 20% produk yang menghasilkan 80% pendapatan</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 border border-border/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Pendapatan</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Produk Top (80% Revenue)</p>
            <p className="text-xl font-bold text-primary">{topProducts.length} dari {paretoData.length} produk</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card/50 border border-border/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Kontribusi Top Products</p>
            </div>
            <p className="text-xl font-bold text-foreground">{topProducts.length > 0 ? topProducts[topProducts.length - 1].cumulativePercent : 0}%</p>
          </motion.div>
        </div>

        {/* Pareto Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card/50 border border-border/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Grafik Pareto
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} angle={-30} textAnchor="end" height={80} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${(v / 1000000).toFixed(1)}jt`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => [name === 'revenue' ? formatCurrency(value) : `${value}%`, name === 'revenue' ? 'Pendapatan' : 'Kumulatif']}
              />
              <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Ranking */}
        <div className="bg-card/50 border border-border/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Ranking Produk</h3>
          <div className="space-y-2">
            {paretoData.map((p, i) => (
              <div key={p.name} className={`flex items-center justify-between px-3 py-2 rounded-lg ${i <= threshold80 ? 'bg-primary/5 border border-primary/15' : 'bg-secondary/20'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(p.revenue)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{p.cumulativePercent}%</p>
                  <p className="text-xs text-muted-foreground">kumulatif</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalisisPareto;
