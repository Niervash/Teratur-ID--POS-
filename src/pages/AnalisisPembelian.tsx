import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingDown, TrendingUp, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { rawMaterials } from '@/data/mockData';

const AnalisisPembelian = () => {
  // Generate mock purchase trend data
  const purchaseTrend = [
    { bulan: 'Jan', total: 4500000 },
    { bulan: 'Feb', total: 5200000 },
    { bulan: 'Mar', total: 4800000 },
    { bulan: 'Apr', total: 5600000 },
    { bulan: 'Mei', total: 5100000 },
    { bulan: 'Jun', total: 4900000 },
  ];

  // Category breakdown from rawMaterials
  const categoryMap: Record<string, number> = {};
  rawMaterials.forEach(m => {
    const cat = m.category === 'bahan_baku' ? 'Bahan Baku' : m.category === 'tenaga_kerja' ? 'Tenaga Kerja' : m.category === 'overhead' ? 'Overhead' : m.category === 'operasional' ? 'Operasional' : 'Administrasi';
    categoryMap[cat] = (categoryMap[cat] || 0) + (m.pricePerUnit * m.stockCurrent);
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--chart-4))'];
  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

  const totalPembelian = purchaseTrend.reduce((s, p) => s + p.total, 0);
  const avgBulanan = totalPembelian / purchaseTrend.length;
  const lastMonth = purchaseTrend[purchaseTrend.length - 1].total;
  const prevMonth = purchaseTrend[purchaseTrend.length - 2].total;
  const trendPersen = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analisis Pembelian</h1>
          <p className="text-muted-foreground text-sm">Analisis tren pembelian bahan baku dan efisiensi biaya</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total 6 Bulan', value: formatCurrency(totalPembelian), icon: ShoppingCart, color: 'text-primary' },
            { label: 'Rata-rata/Bulan', value: formatCurrency(avgBulanan), icon: Package, color: 'text-accent' },
            { label: 'Bulan Terakhir', value: formatCurrency(lastMonth), icon: TrendingUp, color: 'text-warning' },
            { label: 'Tren', value: `${Number(trendPersen) >= 0 ? '+' : ''}${trendPersen}%`, icon: Number(trendPersen) >= 0 ? TrendingUp : TrendingDown, color: Number(trendPersen) >= 0 ? 'text-destructive' : 'text-primary' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card/50 border border-border/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-card/50 border border-border/30 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Tren Pembelian Bulanan</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={purchaseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${(v / 1000000).toFixed(1)}jt`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} formatter={(v: number) => [formatCurrency(v), 'Total']} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-card/50 border border-border/30 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Komposisi per Kategori</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} formatter={(v: number) => [formatCurrency(v), 'Nilai']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {categoryData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="text-foreground font-medium">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Materials */}
        <div className="bg-card/50 border border-border/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Bahan Baku Terbanyak Dibeli</h3>
          <div className="space-y-2">
            {rawMaterials.sort((a, b) => (b.pricePerUnit * b.stockCurrent) - (a.pricePerUnit * a.stockCurrent)).slice(0, 5).map((m, i) => (
              <div key={m.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/20">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.stockCurrent} {m.unit} × {formatCurrency(m.pricePerUnit)}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatCurrency(m.pricePerUnit * m.stockCurrent)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalisisPembelian;
