import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { XCircle, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface RejectedSale {
  id: string;
  noTransaksi: string;
  tanggal: string;
  kasir: string;
  produk: string;
  total: number;
  alasan: string;
}

const PenjualanTertolak = () => {
  const [rejected, setRejected] = useLocalStorage<RejectedSale[]>('teratur_rejected_sales', [
    { id: '1', noTransaksi: 'TRX-R001', tanggal: '2025-01-20 14:30', kasir: 'Kasir 1', produk: 'Nasi Goreng x2', total: 50000, alasan: 'Pembayaran gagal' },
    { id: '2', noTransaksi: 'TRX-R002', tanggal: '2025-01-19 16:00', kasir: 'Kasir 2', produk: 'Ayam Bakar x1', total: 35000, alasan: 'Stok habis' },
    { id: '3', noTransaksi: 'TRX-R003', tanggal: '2025-01-19 10:15', kasir: 'Kasir 1', produk: 'Es Teh x5', total: 25000, alasan: 'Pelanggan batal' },
  ]);
  const [search, setSearch] = useState('');

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);
  const filtered = rejected.filter(r => r.noTransaksi.toLowerCase().includes(search.toLowerCase()) || r.alasan.toLowerCase().includes(search.toLowerCase()));
  const totalLost = filtered.reduce((a, b) => a + b.total, 0);

  const handleDelete = (id: string) => {
    setRejected(rejected.filter(r => r.id !== id));
    toast.success('Data dihapus');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Penjualan Tertolak</h1><p className="text-muted-foreground text-sm">Daftar penjualan yang ditolak atau gagal</p></div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Total Tertolak</p><p className="text-2xl font-bold text-destructive">{filtered.length}</p></div>
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Potensi Hilang</p><p className="text-2xl font-bold text-destructive">{formatCurrency(totalLost)}</p></div>
        </div>

        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Cari..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>

        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/50 bg-muted/30"><th className="text-left p-3 text-sm font-medium text-muted-foreground">No. Transaksi</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Tanggal</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Kasir</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Produk</th><th className="text-right p-3 text-sm font-medium text-muted-foreground">Total</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Alasan</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Aksi</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium text-foreground">{r.noTransaksi}</td>
                  <td className="p-3 text-sm text-muted-foreground">{r.tanggal}</td>
                  <td className="p-3 text-sm text-foreground">{r.kasir}</td>
                  <td className="p-3 text-sm text-foreground">{r.produk}</td>
                  <td className="p-3 text-sm text-right font-medium text-destructive">{formatCurrency(r.total)}</td>
                  <td className="p-3"><Badge className="bg-destructive/10 text-destructive">{r.alasan}</Badge></td>
                  <td className="p-3 text-center"><Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">Tidak ada penjualan tertolak</div>}
        </div>
      </motion.div>
    </Layout>
  );
};

export default PenjualanTertolak;
