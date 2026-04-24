import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Eye, Check, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Pesanan {
  id: string;
  noPesanan: string;
  pelanggan: string;
  tanggal: string;
  items: { nama: string; qty: number; harga: number }[];
  total: number;
  status: 'pending' | 'diproses' | 'selesai' | 'dibatalkan';
  catatan: string;
}

const PesananPenjualan = () => {
  const [pesanan, setPesanan] = useLocalStorage<Pesanan[]>('teratur_pesanan', [
    { id: '1', noPesanan: 'PO-001', pelanggan: 'Budi Santoso', tanggal: '2025-01-20', items: [{ nama: 'Nasi Goreng', qty: 5, harga: 25000 }, { nama: 'Es Teh', qty: 5, harga: 5000 }], total: 150000, status: 'pending', catatan: 'Antar jam 12' },
    { id: '2', noPesanan: 'PO-002', pelanggan: 'Siti Aminah', tanggal: '2025-01-20', items: [{ nama: 'Ayam Bakar', qty: 3, harga: 35000 }], total: 105000, status: 'diproses', catatan: '' },
    { id: '3', noPesanan: 'PO-003', pelanggan: 'Andi Wijaya', tanggal: '2025-01-19', items: [{ nama: 'Mie Goreng', qty: 10, harga: 20000 }], total: 200000, status: 'selesai', catatan: 'Pesanan catering' },
  ]);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ pelanggan: '', catatan: '', itemNama: '', itemQty: '', itemHarga: '' });

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);
  const statusColor = (s: string) => s === 'pending' ? 'bg-warning/10 text-warning' : s === 'diproses' ? 'bg-primary/10 text-primary' : s === 'selesai' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive';

  const handleAdd = () => {
    if (!form.pelanggan || !form.itemNama || !form.itemQty || !form.itemHarga) { toast.error('Lengkapi data'); return; }
    const qty = parseInt(form.itemQty);
    const harga = parseInt(form.itemHarga);
    const newPesanan: Pesanan = {
      id: Date.now().toString(), noPesanan: `PO-${String(pesanan.length + 1).padStart(3, '0')}`,
      pelanggan: form.pelanggan, tanggal: new Date().toISOString().split('T')[0],
      items: [{ nama: form.itemNama, qty, harga }], total: qty * harga,
      status: 'pending', catatan: form.catatan,
    };
    setPesanan([newPesanan, ...pesanan]);
    setForm({ pelanggan: '', catatan: '', itemNama: '', itemQty: '', itemHarga: '' });
    setAddOpen(false);
    toast.success('Pesanan ditambahkan');
  };

  const updateStatus = (id: string, status: Pesanan['status']) => {
    setPesanan(pesanan.map(p => p.id === id ? { ...p, status } : p));
    toast.success(`Status diubah ke ${status}`);
  };

  const filtered = pesanan.filter(p => p.pelanggan.toLowerCase().includes(search.toLowerCase()) || p.noPesanan.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pesanan Penjualan</h1>
            <p className="text-muted-foreground text-sm">Kelola pesanan penjualan yang masuk</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Tambah Pesanan</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Pesanan Baru</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Nama Pelanggan" value={form.pelanggan} onChange={e => setForm({ ...form, pelanggan: e.target.value })} />
                <Input placeholder="Nama Item" value={form.itemNama} onChange={e => setForm({ ...form, itemNama: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Qty" value={form.itemQty} onChange={e => setForm({ ...form, itemQty: e.target.value })} />
                  <Input type="number" placeholder="Harga" value={form.itemHarga} onChange={e => setForm({ ...form, itemHarga: e.target.value })} />
                </div>
                <Input placeholder="Catatan (opsional)" value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Cari pesanan..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/50 bg-muted/30"><th className="text-left p-3 text-sm font-medium text-muted-foreground">No. Pesanan</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Pelanggan</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Tanggal</th><th className="text-right p-3 text-sm font-medium text-muted-foreground">Total</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Status</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Aksi</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium text-foreground">{p.noPesanan}</td>
                  <td className="p-3 text-sm text-foreground">{p.pelanggan}</td>
                  <td className="p-3 text-sm text-muted-foreground">{p.tanggal}</td>
                  <td className="p-3 text-sm text-right font-medium text-foreground">{formatCurrency(p.total)}</td>
                  <td className="p-3 text-center"><Badge className={statusColor(p.status)}>{p.status}</Badge></td>
                  <td className="p-3 text-center space-x-1">
                    {p.status === 'pending' && <><Button size="sm" variant="outline" onClick={() => updateStatus(p.id, 'diproses')}><Check className="w-3 h-3" /></Button><Button size="sm" variant="outline" onClick={() => updateStatus(p.id, 'dibatalkan')}><X className="w-3 h-3" /></Button></>}
                    {p.status === 'diproses' && <Button size="sm" variant="outline" onClick={() => updateStatus(p.id, 'selesai')}><Check className="w-3 h-3 mr-1" />Selesai</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">Tidak ada pesanan</div>}
        </div>
      </motion.div>
    </Layout>
  );
};

export default PesananPenjualan;
