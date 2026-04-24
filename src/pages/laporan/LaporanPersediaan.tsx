import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, AlertTriangle, TrendingDown, Warehouse } from 'lucide-react';
import { products } from '@/data/mockData';

const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const stockMovement = [
  { month: 'Jan', masuk: 500, keluar: 420 }, { month: 'Feb', masuk: 550, keluar: 480 },
  { month: 'Mar', masuk: 480, keluar: 450 }, { month: 'Apr', masuk: 600, keluar: 560 },
  { month: 'Mei', masuk: 520, keluar: 500 }, { month: 'Jun', masuk: 580, keluar: 540 },
];

const LaporanPersediaan = () => {
  const totalStock = products.reduce((s, p) => s + p.stockCurrent, 0);
  const lowStock = products.filter(p => p.stockCurrent < p.stockInitial * 0.3);
  const totalValue = products.reduce((s, p) => s + p.stockCurrent * p.hpp, 0);

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Laporan Persediaan</h1>
          <p className="text-muted-foreground">Pantau stok dan pergerakan barang</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Stok', value: `${totalStock} unit`, icon: Package, color: 'text-blue-600' },
            { label: 'Nilai Persediaan', value: formatCurrency(totalValue), icon: Warehouse, color: 'text-green-600' },
            { label: 'Stok Rendah', value: `${lowStock.length} produk`, icon: AlertTriangle, color: 'text-amber-600' },
            { label: 'Jenis Produk', value: `${products.length}`, icon: TrendingDown, color: 'text-purple-600' },
          ].map(kpi => (
            <Card key={kpi.label} className="p-4">
              <div className="flex items-center gap-2 mb-1"><kpi.icon className={`w-4 h-4 ${kpi.color}`} /><p className="text-xs text-muted-foreground">{kpi.label}</p></div>
              <p className="text-xl font-bold">{kpi.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Pergerakan Stok Bulanan</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stockMovement}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="masuk" fill="hsl(var(--primary))" name="Masuk" radius={[4, 4, 0, 0]} />
                <Bar dataKey="keluar" fill="#ef4444" name="Keluar" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Stok Rendah ⚠️</h3>
            <div className="space-y-3">
              {lowStock.length > 0 ? lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Stok awal: {p.stockInitial}</p>
                  </div>
                  <Badge variant="destructive">{p.stockCurrent} {p.unit}</Badge>
                </div>
              )) : <p className="text-sm text-muted-foreground">Semua stok dalam kondisi aman ✅</p>}
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Detail Stok Produk</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2 text-muted-foreground">Produk</th><th className="text-right py-2 text-muted-foreground">Stok Awal</th><th className="text-right py-2 text-muted-foreground">Stok Saat Ini</th><th className="text-right py-2 text-muted-foreground">Nilai</th><th className="text-right py-2 text-muted-foreground">Status</th></tr></thead>
              <tbody>
                {products.map(p => {
                  const pct = (p.stockCurrent / p.stockInitial) * 100;
                  return (
                    <tr key={p.id} className="border-b border-border/50">
                      <td className="py-2">{p.emoji} {p.name}</td>
                      <td className="py-2 text-right">{p.stockInitial}</td>
                      <td className="py-2 text-right">{p.stockCurrent}</td>
                      <td className="py-2 text-right">{formatCurrency(p.stockCurrent * p.hpp)}</td>
                      <td className="py-2 text-right">
                        <Badge variant={pct > 50 ? 'default' : pct > 30 ? 'secondary' : 'destructive'}>
                          {pct > 50 ? 'Aman' : pct > 30 ? 'Sedang' : 'Rendah'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default LaporanPersediaan;
