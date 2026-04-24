import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exportToCSV } from '@/lib/exportUtils';

interface SaleRecord {
  id: string;
  noTransaksi: string;
  tanggal: string;
  kasir: string;
  items: { nama: string; qty: number; harga: number }[];
  total: number;
  metodeBayar: 'cash' | 'card' | 'qris';
}

const DaftarPenjualan = () => {
  const [sales] = useLocalStorage<SaleRecord[]>('teratur_sales', [
    { id: '1', noTransaksi: 'TRX-001', tanggal: '2025-01-20 10:30', kasir: 'Kasir 1', items: [{ nama: 'Nasi Goreng', qty: 2, harga: 25000 }], total: 50000, metodeBayar: 'cash' },
    { id: '2', noTransaksi: 'TRX-002', tanggal: '2025-01-20 11:15', kasir: 'Kasir 1', items: [{ nama: 'Ayam Bakar', qty: 1, harga: 35000 }, { nama: 'Es Teh', qty: 1, harga: 5000 }], total: 40000, metodeBayar: 'qris' },
    { id: '3', noTransaksi: 'TRX-003', tanggal: '2025-01-20 12:00', kasir: 'Kasir 2', items: [{ nama: 'Mie Goreng', qty: 3, harga: 20000 }], total: 60000, metodeBayar: 'card' },
    { id: '4', noTransaksi: 'TRX-004', tanggal: '2025-01-19 09:45', kasir: 'Kasir 1', items: [{ nama: 'Nasi Goreng', qty: 5, harga: 25000 }], total: 125000, metodeBayar: 'cash' },
  ]);
  const [search, setSearch] = useState('');

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);
  const metodeBadge = (m: string) => m === 'cash' ? 'bg-green-500/10 text-green-600' : m === 'qris' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent-foreground';

  const filtered = sales.filter(s => s.noTransaksi.toLowerCase().includes(search.toLowerCase()) || s.kasir.toLowerCase().includes(search.toLowerCase()));
  const totalRevenue = filtered.reduce((a, b) => a + b.total, 0);

  const handleExport = () => {
    exportToCSV(filtered.map(s => ({ 'No Transaksi': s.noTransaksi, Tanggal: s.tanggal, Kasir: s.kasir, Total: s.total, 'Metode Bayar': s.metodeBayar })), 'daftar_penjualan');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daftar Penjualan</h1>
            <p className="text-muted-foreground text-sm">Riwayat semua transaksi penjualan</p>
          </div>
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Total Transaksi</p><p className="text-2xl font-bold text-foreground">{filtered.length}</p></div>
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p></div>
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Rata-rata</p><p className="text-2xl font-bold text-foreground">{formatCurrency(filtered.length ? totalRevenue / filtered.length : 0)}</p></div>
        </div>

        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Cari transaksi..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>

        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/50 bg-muted/30"><th className="text-left p-3 text-sm font-medium text-muted-foreground">No. Transaksi</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Tanggal</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Kasir</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Items</th><th className="text-right p-3 text-sm font-medium text-muted-foreground">Total</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Metode</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium text-foreground">{s.noTransaksi}</td>
                  <td className="p-3 text-sm text-muted-foreground">{s.tanggal}</td>
                  <td className="p-3 text-sm text-foreground">{s.kasir}</td>
                  <td className="p-3 text-sm text-muted-foreground">{s.items.map(i => `${i.qty}x ${i.nama}`).join(', ')}</td>
                  <td className="p-3 text-sm text-right font-medium text-foreground">{formatCurrency(s.total)}</td>
                  <td className="p-3 text-center"><Badge className={metodeBadge(s.metodeBayar)}>{s.metodeBayar.toUpperCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">Tidak ada data penjualan</div>}
        </div>
      </motion.div>
    </Layout>
  );
};

export default DaftarPenjualan;
