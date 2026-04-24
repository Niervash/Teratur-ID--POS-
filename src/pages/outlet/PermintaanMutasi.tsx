import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Plus, Search, Send, Check, X, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select } from 'antd';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface MutasiRequest {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  fromOutlet: string;
  toOutlet: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  notes: string;
}

const outlets = ['Outlet Pusat', 'Outlet Cabang 1', 'Outlet Cabang 2', 'Outlet Cabang 3'];

const PermintaanMutasi = () => {
  const [requests, setRequests] = useLocalStorage<MutasiRequest[]>('teratur_mutasi_requests', [
    { id: '1', productName: 'Biji Kopi Arabica', quantity: 5, unit: 'kg', fromOutlet: 'Outlet Pusat', toOutlet: 'Outlet Cabang 1', status: 'pending', date: '2025-01-20', notes: 'Stok menipis' },
    { id: '2', productName: 'Susu UHT', quantity: 10, unit: 'liter', fromOutlet: 'Outlet Cabang 2', toOutlet: 'Outlet Pusat', status: 'approved', date: '2025-01-19', notes: 'Kelebihan stok' },
    { id: '3', productName: 'Gula Aren', quantity: 3, unit: 'kg', fromOutlet: 'Outlet Pusat', toOutlet: 'Outlet Cabang 3', status: 'rejected', date: '2025-01-18', notes: 'Urgent' },
  ]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ productName: '', quantity: '', unit: 'kg', fromOutlet: '', toOutlet: '', notes: '' });

  const filtered = requests.filter(r => r.productName.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.productName || !form.quantity || !form.fromOutlet || !form.toOutlet) { toast.error('Lengkapi semua field'); return; }
    const newReq: MutasiRequest = {
      id: Date.now().toString(), productName: form.productName, quantity: parseInt(form.quantity),
      unit: form.unit, fromOutlet: form.fromOutlet, toOutlet: form.toOutlet,
      status: 'pending', date: new Date().toISOString().split('T')[0], notes: form.notes,
    };
    setRequests([newReq, ...requests]);
    toast.success('Permintaan mutasi dibuat');
    setDialogOpen(false);
    setForm({ productName: '', quantity: '', unit: 'kg', fromOutlet: '', toOutlet: '', notes: '' });
  };

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Permintaan ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
  };

  const statusConfig = {
    pending: { label: 'Menunggu', icon: Clock, variant: 'secondary' as const },
    approved: { label: 'Disetujui', icon: Check, variant: 'default' as const },
    rejected: { label: 'Ditolak', icon: X, variant: 'destructive' as const },
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Permintaan Mutasi</h1>
            <p className="text-muted-foreground">Ajukan dan kelola permintaan mutasi stok antar outlet</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Buat Permintaan</Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="space-y-3">
          {filtered.map(req => {
            const sc = statusConfig[req.status];
            return (
              <Card key={req.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{req.productName}</p>
                      <Badge variant={sc.variant}><sc.icon className="w-3 h-3 mr-1" />{sc.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.quantity} {req.unit} • {req.fromOutlet} → {req.toOutlet}</p>
                    {req.notes && <p className="text-xs text-muted-foreground mt-1">📝 {req.notes}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{req.date}</p>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, 'approved')}><Check className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, 'rejected')}><X className="w-4 h-4" /></Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Tidak ada permintaan mutasi</p>}
        </div>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Permintaan Mutasi</DialogTitle>
            <DialogDescription>Isi detail permintaan mutasi stok</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5"><Label>Nama Produk</Label><Input value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Jumlah</Label><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Satuan</Label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Dari Outlet</Label>
              <Select 
                className="w-full h-10"
                dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                suffixIcon={<ChevronDown className="w-3 h-3" />}
                placeholder="Pilih outlet asal"
                value={form.fromOutlet || undefined} 
                onChange={v => setForm({ ...form, fromOutlet: v })}
                options={outlets.map(o => ({ value: o, label: o }))}
              />
            </div>
            <div className="space-y-1.5"><Label>Ke Outlet</Label>
              <Select 
                className="w-full h-10"
                dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                suffixIcon={<ChevronDown className="w-3 h-3" />}
                placeholder="Pilih outlet tujuan"
                value={form.toOutlet || undefined} 
                onChange={v => setForm({ ...form, toOutlet: v })}
                options={outlets.map(o => ({ value: o, label: o }))}
              />
            </div>
            <div className="space-y-1.5"><Label>Catatan</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <Button onClick={handleAdd} className="w-full mt-2">Kirim Permintaan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PermintaanMutasi;
