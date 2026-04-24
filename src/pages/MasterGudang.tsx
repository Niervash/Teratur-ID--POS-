import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Warehouse, X, Check, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface Gudang {
  id: string;
  nama: string;
  lokasi: string;
  kapasitas: string;
  status: 'aktif' | 'nonaktif';
}

const defaultGudang: Gudang[] = [
  { id: '1', nama: 'Gudang Utama', lokasi: 'Lantai 1 - Area Belakang', kapasitas: 'Besar', status: 'aktif' },
  { id: '2', nama: 'Gudang Bumbu', lokasi: 'Lantai 1 - Dapur', kapasitas: 'Kecil', status: 'aktif' },
  { id: '3', nama: 'Cold Storage', lokasi: 'Lantai 1 - Ruang Pendingin', kapasitas: 'Sedang', status: 'aktif' },
  { id: '4', nama: 'Gudang Packaging', lokasi: 'Lantai 2', kapasitas: 'Sedang', status: 'nonaktif' },
];

const MasterGudang = () => {
  const { toast } = useToast();
  const [gudangList, setGudangList] = useLocalStorage<Gudang[]>('teratur_gudang', defaultGudang);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', lokasi: '', kapasitas: 'Sedang', status: 'aktif' as Gudang['status'] });

  const resetForm = () => { setForm({ nama: '', lokasi: '', kapasitas: 'Sedang', status: 'aktif' }); setIsAdding(false); setEditingId(null); };

  const handleSave = () => {
    if (!form.nama.trim()) {
      toast({ title: 'Error', description: 'Nama gudang wajib diisi', variant: 'destructive' });
      return;
    }
    if (editingId) {
      setGudangList(prev => prev.map(g => g.id === editingId ? { ...g, ...form } : g));
      toast({ title: 'Berhasil', description: 'Gudang diperbarui' });
    } else {
      setGudangList(prev => [...prev, { id: Date.now().toString(), ...form }]);
      toast({ title: 'Berhasil', description: 'Gudang ditambahkan' });
    }
    resetForm();
  };

  const handleEdit = (g: Gudang) => { setForm({ nama: g.nama, lokasi: g.lokasi, kapasitas: g.kapasitas, status: g.status }); setEditingId(g.id); setIsAdding(true); };
  const handleDelete = (id: string) => { setGudangList(prev => prev.filter(g => g.id !== id)); toast({ title: 'Dihapus', description: 'Gudang dihapus' }); };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Master Gudang</h1>
            <p className="text-muted-foreground text-sm">Kelola data gudang penyimpanan bahan baku</p>
          </div>
          <Button onClick={() => { resetForm(); setIsAdding(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Gudang
          </Button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-card/50 border border-border/30 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-foreground">{editingId ? 'Edit' : 'Tambah'} Gudang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input placeholder="Nama gudang" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
                  <Input placeholder="Lokasi" value={form.lokasi} onChange={e => setForm(f => ({ ...f, lokasi: e.target.value }))} />
                  <Select 
                    className="w-full h-10"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-3 h-3" />}
                    value={form.kapasitas} 
                    onChange={v => setForm(f => ({ ...f, kapasitas: v }))}
                    options={[
                      { value: 'Kecil', label: 'Kecil' },
                      { value: 'Sedang', label: 'Sedang' },
                      { value: 'Besar', label: 'Besar' },
                    ]}
                  />
                  <Select 
                    className="w-full h-10"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-3 h-3" />}
                    value={form.status} 
                    onChange={v => setForm(f => ({ ...f, status: v as Gudang['status'] }))}
                    options={[
                      { value: 'aktif', label: 'Aktif' },
                      { value: 'nonaktif', label: 'Nonaktif' },
                    ]}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="gap-1"><Check className="w-4 h-4" /> Simpan</Button>
                  <Button onClick={resetForm} size="sm" variant="outline" className="gap-1"><X className="w-4 h-4" /> Batal</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-3 md:grid-cols-2">
          {gudangList.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card/50 border border-border/30 rounded-xl p-4 hover:bg-card/80 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                    <Warehouse className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{g.nama}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" /> {g.lokasi || 'Belum diatur'}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/50 text-muted-foreground">
                        {g.kapasitas}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${g.status === 'aktif' ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'}`}>
                        {g.status === 'aktif' ? '● Aktif' : '○ Nonaktif'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(g)} className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(g.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MasterGudang;
