import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { RotateCcw, Plus, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Retur {
  id: string;
  noRetur: string;
  noTransaksi: string;
  tanggal: string;
  pelanggan: string;
  produk: string;
  qty: number;
  alasan: string;
  total: number;
  status: 'pending' | 'disetujui' | 'ditolak';
}

const ReturPenjualan = () => {
  const [returs, setReturs] = useLocalStorage<Retur[]>('teratur_retur', [
    { id: '1', noRetur: 'RTR-001', noTransaksi: 'TRX-001', tanggal: '2025-01-20', pelanggan: 'Budi', produk: 'Nasi Goreng', qty: 1, alasan: 'Pesanan salah', total: 25000, status: 'pending' },
    { id: '2', noRetur: 'RTR-002', noTransaksi: 'TRX-003', tanggal: '2025-01-19', pelanggan: 'Andi', produk: 'Mie Goreng', qty: 2, alasan: 'Kualitas buruk', total: 40000, status: 'disetujui' },
  ]);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ noTransaksi: '', pelanggan: '', produk: '', qty: '', alasan: '', harga: '' });

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  const handleAdd = () => {
    if (!form.noTransaksi || !form.produk || !form.qty || !form.harga) { toast.error('Lengkapi data'); return; }
    const qty = parseInt(form.qty);
    const harga = parseInt(form.harga);
    const newRetur: Retur = {
      id: Date.now().toString(), noRetur: `RTR-${String(returs.length + 1).padStart(3, '0')}`,
      noTransaksi: form.noTransaksi, tanggal: new Date().toISOString().split('T')[0],
      pelanggan: form.pelanggan, produk: form.produk, qty, alasan: form.alasan, total: qty * harga, status: 'pending',
    };
    setReturs([newRetur, ...returs]);
    setForm({ noTransaksi: '', pelanggan: '', produk: '', qty: '', alasan: '', harga: '' });
    setAddOpen(false);
    toast.success('Retur ditambahkan');
  };

  const updateStatus = (id: string, status: Retur['status']) => {
    setReturs(returs.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Status diubah ke ${status}`);
  };

  const filtered = returs.filter(r => r.noRetur.toLowerCase().includes(search.toLowerCase()) || r.pelanggan.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Retur Penjualan</h1><p className="text-muted-foreground text-sm">Kelola pengembalian barang dari pelanggan</p></div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Tambah Retur</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Retur Baru</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="No. Transaksi Asal" value={form.noTransaksi} onChange={e => setForm({ ...form, noTransaksi: e.target.value })} />
                <Input placeholder="Nama Pelanggan" value={form.pelanggan} onChange={e => setForm({ ...form, pelanggan: e.target.value })} />
                <Input placeholder="Nama Produk" value={form.produk} onChange={e => setForm({ ...form, produk: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Qty" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
                  <Input type="number" placeholder="Harga Satuan" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} />
                </div>
                <Input placeholder="Alasan retur" value={form.alasan} onChange={e => setForm({ ...form, alasan: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Cari retur..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/50 bg-muted/30"><th className="text-left p-3 text-sm font-medium text-muted-foreground">No. Retur</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">No. Transaksi</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Produk</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Alasan</th><th className="text-right p-3 text-sm font-medium text-muted-foreground">Total</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Status</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Aksi</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium text-foreground">{r.noRetur}</td>
                  <td className="p-3 text-sm text-muted-foreground">{r.noTransaksi}</td>
                  <td className="p-3 text-sm text-foreground">{r.qty}x {r.produk}</td>
                  <td className="p-3 text-sm text-muted-foreground">{r.alasan}</td>
                  <td className="p-3 text-sm text-right font-medium text-foreground">{formatCurrency(r.total)}</td>
                  <td className="p-3 text-center"><Badge className={r.status === 'pending' ? 'bg-warning/10 text-warning' : r.status === 'disetujui' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}>{r.status}</Badge></td>
                  <td className="p-3 text-center space-x-1">
                    {r.status === 'pending' && <><Button size="sm" variant="outline" onClick={() => updateStatus(r.id, 'disetujui')}><Check className="w-3 h-3" /></Button><Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, 'ditolak')}>✕</Button></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">Tidak ada data retur</div>}
        </div>
      </motion.div>
    </Layout>
  );
};

export default ReturPenjualan;
