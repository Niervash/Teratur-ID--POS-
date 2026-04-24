import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, Package, Truck, BarChart3, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportToCSV, exportToExcel } from '@/lib/exportUtils';

const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const monthlyData = [
  { month: 'Jan', total: 8500000 }, { month: 'Feb', total: 9200000 }, { month: 'Mar', total: 7800000 },
  { month: 'Apr', total: 10500000 }, { month: 'Mei', total: 9800000 }, { month: 'Jun', total: 11200000 },
];

const categoryData = [
  { name: 'Bahan Baku', value: 35000000 }, { name: 'Packaging', value: 8000000 },
  { name: 'Overhead', value: 5000000 }, { name: 'Operasional', value: 9000000 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

const suppliers = [
  { name: 'PT Kopi Nusantara', total: 15000000, items: 12 },
  { name: 'CV Susu Segar', total: 8500000, items: 8 },
  { name: 'UD Packaging Jaya', total: 6200000, items: 15 },
  { name: 'TB Gula Manis', total: 4800000, items: 6 },
];

const LaporanPembelian = () => {
  const handleExport = (type: 'csv' | 'excel') => {
    const data = monthlyData.map(d => ({ Bulan: d.month, 'Total Pembelian': d.total }));
    type === 'csv' ? exportToCSV(data, 'laporan_pembelian') : exportToExcel(data, 'laporan_pembelian');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Laporan Pembelian</h1>
            <p className="text-muted-foreground">Ringkasan pembelian dan pengeluaran bahan</p>
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
            { label: 'Total Pembelian', value: formatCurrency(57000000), icon: TrendingDown, color: 'text-destructive' },
            { label: 'Total Item', value: '41 item', icon: Package, color: 'text-primary' },
            { label: 'Supplier Aktif', value: '4', icon: Truck, color: 'text-success' },
            { label: 'Rata-rata/Bulan', value: formatCurrency(9500000), icon: BarChart3, color: 'text-accent-foreground' },
          ].map(kpi => (
            <Card key={kpi.label} className="p-4">
              <div className="flex items-center gap-2 mb-1"><kpi.icon className={`w-4 h-4 ${kpi.color}`} /><p className="text-xs text-muted-foreground">{kpi.label}</p></div>
              <p className="text-xl font-bold">{kpi.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Trend Pembelian Bulanan</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={v => `${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="total" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Komposisi Pembelian</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Top Supplier</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2 text-muted-foreground">#</th><th className="text-left py-2 text-muted-foreground">Supplier</th><th className="text-right py-2 text-muted-foreground">Jumlah Item</th><th className="text-right py-2 text-muted-foreground">Total</th></tr></thead>
              <tbody>
                {suppliers.map((s, i) => (
                  <tr key={s.name} className="border-b border-border/50">
                    <td className="py-2">{i + 1}</td><td className="py-2">{s.name}</td>
                    <td className="py-2 text-right">{s.items}</td><td className="py-2 text-right font-medium">{formatCurrency(s.total)}</td>
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

export default LaporanPembelian;
