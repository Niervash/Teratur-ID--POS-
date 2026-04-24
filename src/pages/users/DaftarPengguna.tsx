import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Edit, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select } from 'antd';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'cashier';
  status: 'active' | 'inactive';
  createdAt: string;
}

const DaftarPengguna = () => {
  const [users, setUsers] = useLocalStorage<UserData[]>('teratur_user_list', [
    { id: '1', name: 'Admin Manager', email: 'admin@teratur.id', role: 'manager', status: 'active', createdAt: '2025-01-01' },
    { id: '2', name: 'Kasir 1', email: 'kasir1@teratur.id', role: 'cashier', status: 'active', createdAt: '2025-01-05' },
    { id: '3', name: 'Kasir 2', email: 'kasir2@teratur.id', role: 'cashier', status: 'inactive', createdAt: '2025-01-10' },
  ]);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'cashier' as 'manager' | 'cashier' });

  const handleAdd = () => {
    if (!form.name || !form.email) { toast.error('Lengkapi data'); return; }
    setUsers([...users, { id: Date.now().toString(), name: form.name, email: form.email, role: form.role, status: 'active', createdAt: new Date().toISOString().split('T')[0] }]);
    setForm({ name: '', email: '', role: 'cashier' });
    setAddOpen(false);
    toast.success('Pengguna ditambahkan');
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    toast.success('Status diubah');
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('Pengguna dihapus');
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Daftar Pengguna</h1><p className="text-muted-foreground text-sm">Kelola semua akun pengguna dalam sistem</p></div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Tambah Pengguna</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Pengguna Baru</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Input placeholder="Nama" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Select 
                    className="w-full h-10"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-3 h-3" />}
                    value={form.role} 
                    onChange={v => setForm({ ...form, role: v as 'manager' | 'cashier' })}
                    options={[
                      { value: 'manager', label: 'Manager' },
                      { value: 'cashier', label: 'Kasir' },
                    ]}
                  />
                </div>
                <Button onClick={handleAdd} className="w-full mt-2">Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Cari pengguna..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>

        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/50 bg-muted/30"><th className="text-left p-3 text-sm font-medium text-muted-foreground">Nama</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Role</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Status</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Aksi</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium text-foreground">{u.name}</td>
                  <td className="p-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="p-3 text-center"><Badge className={u.role === 'manager' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent-foreground'}>{u.role}</Badge></td>
                  <td className="p-3 text-center"><Badge className={u.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'} onClick={() => toggleStatus(u.id)} style={{ cursor: 'pointer' }}>{u.status}</Badge></td>
                  <td className="p-3 text-center"><Button size="sm" variant="ghost" onClick={() => handleDelete(u.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Layout>
  );
};

export default DaftarPengguna;
