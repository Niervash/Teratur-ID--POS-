import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Package, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportToCSV, exportToExcel } from '@/lib/exportUtils';

const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const salesData = [
  { month: 'Jan', total: 15200000, qty: 520 },
  { month: 'Feb', total: 18500000, qty: 610 },
  { month: 'Mar', total: 16800000, qty: 580 },
  { month: 'Apr', total: 21000000, qty: 700 },
  { month: 'Mei', total: 19500000, qty: 650 },
  { month: 'Jun', total: 23000000, qty: 780 },
];

const topProducts = [
  { name: 'Kopi Susu Gula Aren', qty: 1250, revenue: 27500000 },
  { name: 'Matcha Latte', qty: 890, revenue: 24920000 },
  { name: 'Es Teh Manis', qty: 1500, revenue: 12000000 },
  { name: 'Americano', qty: 670, revenue: 11390000 },
  { name: 'Cappuccino', qty: 450, revenue: 10800000 },
];

const LaporanPenjualan = () => {
  const handleExport = (type: 'csv' | 'excel') => {
    const data = salesData.map(d => ({ Bulan: d.month, 'Total Penjualan': d.total, 'Jumlah Transaksi': d.qty }));
    type === 'csv' ? exportToCSV(data, 'laporan_penjualan') : exportToExcel(data, 'laporan_penjualan');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
            <p className="text-muted-foreground">Ringkasan performa penjualan bisnis</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>Export Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Revenue', value: formatCurrency(114000000), icon: DollarSign, color: 'text-success' },
            { label: 'Total Transaksi', value: '3,840', icon: ShoppingCart, color: 'text-primary' },
            { label: 'Rata-rata/Hari', value: formatCurrency(3800000), icon: TrendingUp, color: 'text-accent-foreground' },
            { label: 'Produk Terjual', value: '4,760 pcs', icon: Package, color: 'text-warning' },
          ].map(kpi => (
            <Card key={kpi.label} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
              <p className="text-xl font-bold">{kpi.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Trend Penjualan Bulanan</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={v => `${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Jumlah Transaksi Bulanan</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="qty" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Top Produk Terlaris</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2 text-muted-foreground">#</th><th className="text-left py-2 text-muted-foreground">Produk</th><th className="text-right py-2 text-muted-foreground">Qty</th><th className="text-right py-2 text-muted-foreground">Revenue</th></tr></thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.name} className="border-b border-border/50">
                    <td className="py-2 font-medium">{i + 1}</td>
                    <td className="py-2">{p.name}</td>
                    <td className="py-2 text-right">{p.qty.toLocaleString()}</td>
                    <td className="py-2 text-right font-medium">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default LaporanPenjualan;
