import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Ruler, X, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface Satuan {
  id: string;
  nama: string;
  singkatan: string;
  kategori: 'berat' | 'volume' | 'jumlah' | 'panjang';
}

const defaultSatuan: Satuan[] = [
  { id: '1', nama: 'Kilogram', singkatan: 'kg', kategori: 'berat' },
  { id: '2', nama: 'Gram', singkatan: 'g', kategori: 'berat' },
  { id: '3', nama: 'Liter', singkatan: 'L', kategori: 'volume' },
  { id: '4', nama: 'Mililiter', singkatan: 'mL', kategori: 'volume' },
  { id: '5', nama: 'Pieces', singkatan: 'pcs', kategori: 'jumlah' },
  { id: '6', nama: 'Lusin', singkatan: 'lsn', kategori: 'jumlah' },
  { id: '7', nama: 'Bungkus', singkatan: 'bks', kategori: 'jumlah' },
  { id: '8', nama: 'Meter', singkatan: 'm', kategori: 'panjang' },
];

const kategoriLabels: Record<string, string> = { berat: 'Berat', volume: 'Volume', jumlah: 'Jumlah', panjang: 'Panjang' };
const kategoriColors: Record<string, string> = {
  berat: 'bg-primary/15 text-primary',
  volume: 'bg-accent/15 text-accent',
  jumlah: 'bg-warning/15 text-warning',
  panjang: 'bg-destructive/15 text-destructive',
};

const MasterSatuan = () => {
  const { toast } = useToast();
  const [satuanList, setSatuanList] = useLocalStorage<Satuan[]>('teratur_satuan', defaultSatuan);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', singkatan: '', kategori: 'berat' as Satuan['kategori'] });
  const [filterKategori, setFilterKategori] = useState<string>('semua');

  const resetForm = () => { setForm({ nama: '', singkatan: '', kategori: 'berat' }); setIsAdding(false); setEditingId(null); };

  const handleSave = () => {
    if (!form.nama.trim() || !form.singkatan.trim()) {
      toast({ title: 'Error', description: 'Nama dan singkatan wajib diisi', variant: 'destructive' });
      return;
    }
    if (editingId) {
      setSatuanList(prev => prev.map(s => s.id === editingId ? { ...s, ...form } : s));
      toast({ title: 'Berhasil', description: 'Satuan diperbarui' });
    } else {
      setSatuanList(prev => [...prev, { id: Date.now().toString(), ...form }]);
      toast({ title: 'Berhasil', description: 'Satuan ditambahkan' });
    }
    resetForm();
  };

  const handleEdit = (s: Satuan) => { setForm({ nama: s.nama, singkatan: s.singkatan, kategori: s.kategori }); setEditingId(s.id); setIsAdding(true); };
  const handleDelete = (id: string) => { setSatuanList(prev => prev.filter(s => s.id !== id)); toast({ title: 'Dihapus', description: 'Satuan dihapus' }); };

  const filtered = filterKategori === 'semua' ? satuanList : satuanList.filter(s => s.kategori === filterKategori);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Master Satuan</h1>
            <p className="text-muted-foreground text-sm">Kelola satuan ukuran (kg, liter, pcs, dll)</p>
          </div>
          <Button onClick={() => { resetForm(); setIsAdding(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Satuan
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['semua', 'berat', 'volume', 'jumlah', 'panjang'].map(k => (
            <button key={k} onClick={() => setFilterKategori(k)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterKategori === k ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'}`}
            >{k === 'semua' ? 'Semua' : kategoriLabels[k]}</button>
          ))}
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-card/50 border border-border/30 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-foreground">{editingId ? 'Edit' : 'Tambah'} Satuan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Nama satuan" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
                  <Input placeholder="Singkatan (kg, pcs)" value={form.singkatan} onChange={e => setForm(f => ({ ...f, singkatan: e.target.value }))} />
                  <Select 
                    className="w-full h-10"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-3 h-3" />}
                    value={form.kategori} 
                    onChange={v => setForm(f => ({ ...f, kategori: v as Satuan['kategori'] }))}
                    options={[
                      { value: 'berat', label: 'Berat' },
                      { value: 'volume', label: 'Volume' },
                      { value: 'jumlah', label: 'Jumlah' },
                      { value: 'panjang', label: 'Panjang' },
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

        <div className="grid gap-2">
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between bg-card/50 border border-border/30 rounded-xl px-4 py-3 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Ruler className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{s.nama} <span className="text-muted-foreground">({s.singkatan})</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${kategoriColors[s.kategori]}`}>{kategoriLabels[s.kategori]}</span>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(s)} className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MasterSatuan;
