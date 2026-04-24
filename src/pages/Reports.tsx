import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  PieChart
} from 'lucide-react';
import { kpiData, hppBreakdown, transactions, products } from '@/data/mockData';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const Reports = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const labaKotor = kpiData.totalRevenue - kpiData.totalHpp;
  const labaBersih = labaKotor - kpiData.totalExpenseOperasional;

  const profitLossData = [
    { label: 'Pendapatan Penjualan', amount: kpiData.totalRevenue, type: 'income' },
    { label: 'Harga Pokok Penjualan (HPP)', amount: -kpiData.totalHpp, type: 'expense' },
    { label: 'Laba Kotor', amount: labaKotor, type: 'subtotal' },
    { label: 'Beban Operasional', amount: -kpiData.totalExpenseOperasional, type: 'expense' },
    { label: 'Laba/Rugi Bersih', amount: labaBersih, type: 'total' },
  ];

  const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)'];

  const recentTransactions = transactions.slice(0, 10);

  const topProducts = [...products]
    .sort((a, b) => (b.salesCount * b.sellingPrice) - (a.salesCount * a.sellingPrice))
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
      revenue: p.salesCount * p.sellingPrice,
      profit: p.salesCount * (p.sellingPrice - p.hpp),
    }));

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-1">Laporan Laba Rugi</h1>
          <p className="text-muted-foreground">
            Laporan yang dihasilkan otomatis dari transaksi yang dicatat
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 border-l-4 border-l-primary"
        >
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            Perhitungan Laba Rugi
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Laba Kotor</strong> = Pendapatan - HPP</p>
            <p><strong>Laba/Rugi Bersih</strong> = Laba Kotor - Beban Operasional</p>
            <p>HPP mencakup: Bahan baku, tenaga kerja langsung, dan overhead produksi.</p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Total Pendapatan</p>
            <p className="text-2xl font-bold number-display">{formatCurrency(kpiData.totalRevenue)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-destructive" />
              </div>
              <ArrowDownRight className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">Total HPP</p>
            <p className="text-2xl font-bold number-display text-destructive">{formatCurrency(kpiData.totalHpp)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Laba Kotor</p>
            <p className="text-2xl font-bold number-display">{formatCurrency(labaKotor)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stat-card glow-accent"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Laba/Rugi Bersih</p>
            <p className="text-2xl font-bold number-display text-success">{formatCurrency(labaBersih)}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profit/Loss Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="font-semibold mb-4">Detail Laporan Laba Rugi</h3>
            <div className="rounded-xl overflow-hidden border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Keterangan</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Jumlah (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {profitLossData.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`border-t border-border ${
                        item.type === 'subtotal' || item.type === 'total' ? 'bg-secondary/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4">{item.label}</td>
                      <td className={`py-3 px-4 text-right number-display ${
                        item.amount < 0 ? 'text-destructive' : 
                        item.type === 'total' && item.amount > 0 ? 'text-success' : ''
                      }`}>
                        {item.amount < 0 ? `(${formatCurrency(Math.abs(item.amount))})` : formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* HPP Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Detail HPP
            </h3>

            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={hppBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {hppBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {hppBreakdown.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-muted-foreground">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold number-display">{item.percentage}%</span>
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4">Produk dengan Revenue Tertinggi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Profit']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="profit" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4">Transaksi Terakhir</h3>
          <div className="rounded-xl overflow-hidden border border-border overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Jenis</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kategori</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Deskripsi</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="py-3 px-4 text-sm">{tx.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'income' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{tx.category}</td>
                    <td className="py-3 px-4 text-sm">{tx.description}</td>
                    <td className={`py-3 px-4 text-right font-semibold number-display ${
                      tx.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Reports;
