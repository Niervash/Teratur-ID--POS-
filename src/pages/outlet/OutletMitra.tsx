import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Plus, Search, Building2, MapPin, Phone, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
}

const OutletMitra = () => {
  const [outlets, setOutlets] = useLocalStorage<Outlet[]>('teratur_outlet_mitra', [
    { id: '1', name: 'Outlet Cabang 1', address: 'Jl. Sudirman No. 10, Jakarta', phone: '021-1234567', manager: 'Budi Santoso', status: 'active' },
    { id: '2', name: 'Outlet Cabang 2', address: 'Jl. Thamrin No. 5, Jakarta', phone: '021-7654321', manager: 'Sari Dewi', status: 'active' },
    { id: '3', name: 'Outlet Cabang 3', address: 'Jl. Gatot Subroto No. 15, Jakarta', phone: '021-9876543', manager: 'Andi Wijaya', status: 'inactive' },
  ]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', manager: '' });

  const filtered = outlets.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!form.name || !form.address) { toast.error('Lengkapi nama dan alamat'); return; }
    if (editId) {
      setOutlets(outlets.map(o => o.id === editId ? { ...o, ...form } : o));
      toast.success('Outlet diperbarui');
    } else {
      setOutlets([{ id: Date.now().toString(), ...form, status: 'active' }, ...outlets]);
      toast.success('Outlet ditambahkan');
    }
    setDialogOpen(false);
    setEditId(null);
    setForm({ name: '', address: '', phone: '', manager: '' });
  };

  const handleEdit = (o: Outlet) => {
    setEditId(o.id);
    setForm({ name: o.name, address: o.address, phone: o.phone, manager: o.manager });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOutlets(outlets.filter(o => o.id !== id));
    toast.success('Outlet dihapus');
  };

  const toggleStatus = (id: string) => {
    setOutlets(outlets.map(o => o.id === id ? { ...o, status: o.status === 'active' ? 'inactive' : 'active' } : o));
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Daftar Outlet Mitra</h1>
            <p className="text-muted-foreground">Kelola outlet mitra bisnis Anda</p>
          </div>
          <Button onClick={() => { setEditId(null); setForm({ name: '', address: '', phone: '', manager: '' }); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Tambah Outlet
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Cari outlet..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{o.name}</p>
                    <Badge variant={o.status === 'active' ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => toggleStatus(o.id)}>
                      {o.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(o)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(o.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><MapPin className="w-3 h-3" />{o.address}</p>
                <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{o.phone}</p>
                <p>👤 Manager: {o.manager}</p>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Tidak ada outlet</p>}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit' : 'Tambah'} Outlet</DialogTitle>
            <DialogDescription>Isi detail outlet mitra</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Nama Outlet</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Alamat</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div><Label>Telepon</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Manager</Label><Input value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} /></div>
            <Button onClick={handleSave} className="w-full">{editId ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default OutletMitra;
