import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Tag, X, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface Kategori {
  id: string;
  nama: string;
  tipe: 'produk' | 'bahan_baku' | 'pengeluaran';
  deskripsi: string;
}

const defaultKategori: Kategori[] = [
  { id: '1', nama: 'Makanan Utama', tipe: 'produk', deskripsi: 'Menu makanan utama' },
  { id: '2', nama: 'Minuman', tipe: 'produk', deskripsi: 'Berbagai jenis minuman' },
  { id: '3', nama: 'Snack', tipe: 'produk', deskripsi: 'Makanan ringan dan cemilan' },
  { id: '4', nama: 'Sayuran', tipe: 'bahan_baku', deskripsi: 'Bahan baku sayuran segar' },
  { id: '5', nama: 'Protein', tipe: 'bahan_baku', deskripsi: 'Daging, ikan, telur, tahu, tempe' },
  { id: '6', nama: 'Bumbu', tipe: 'bahan_baku', deskripsi: 'Bumbu dapur dan rempah' },
  { id: '7', nama: 'Operasional', tipe: 'pengeluaran', deskripsi: 'Biaya operasional harian' },
  { id: '8', nama: 'Transportasi', tipe: 'pengeluaran', deskripsi: 'Biaya transportasi dan pengiriman' },
];

const tipeLabels: Record<string, string> = {
  produk: 'Produk',
  bahan_baku: 'Bahan Baku',
  pengeluaran: 'Pengeluaran',
};

const tipeColors: Record<string, string> = {
  produk: 'bg-primary/15 text-primary',
  bahan_baku: 'bg-accent/15 text-accent',
  pengeluaran: 'bg-warning/15 text-warning',
};

const MasterKategori = () => {
  const { toast } = useToast();
  const [kategoriList, setKategoriList] = useLocalStorage<Kategori[]>('teratur_kategori', defaultKategori);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', tipe: 'produk' as Kategori['tipe'], deskripsi: '' });
  const [filterTipe, setFilterTipe] = useState<string>('semua');

  const resetForm = () => {
    setForm({ nama: '', tipe: 'produk', deskripsi: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.nama.trim()) {
      toast({ title: 'Error', description: 'Nama kategori wajib diisi', variant: 'destructive' });
      return;
    }
    if (editingId) {
      setKategoriList(prev => prev.map(k => k.id === editingId ? { ...k, ...form } : k));
      toast({ title: 'Berhasil', description: 'Kategori diperbarui' });
    } else {
      const newItem: Kategori = { id: Date.now().toString(), ...form };
      setKategoriList(prev => [...prev, newItem]);
      toast({ title: 'Berhasil', description: 'Kategori ditambahkan' });
    }
    resetForm();
  };

  const handleEdit = (k: Kategori) => {
    setForm({ nama: k.nama, tipe: k.tipe, deskripsi: k.deskripsi });
    setEditingId(k.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setKategoriList(prev => prev.filter(k => k.id !== id));
    toast({ title: 'Dihapus', description: 'Kategori berhasil dihapus' });
  };

  const filtered = filterTipe === 'semua' ? kategoriList : kategoriList.filter(k => k.tipe === filterTipe);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Master Kategori</h1>
            <p className="text-muted-foreground text-sm">Kelola kategori produk, bahan baku, dan pengeluaran</p>
          </div>
          <Button onClick={() => { resetForm(); setIsAdding(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['semua', 'produk', 'bahan_baku', 'pengeluaran'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTipe(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterTipe === t ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'semua' ? 'Semua' : tipeLabels[t]}
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card/50 border border-border/30 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-foreground">{editingId ? 'Edit' : 'Tambah'} Kategori</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Nama kategori" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
                  <Select 
                    className="w-full h-10"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-3 h-3" />}
                    value={form.tipe} 
                    onChange={v => setForm(f => ({ ...f, tipe: v as Kategori['tipe'] }))}
                    options={[
                      { value: 'produk', label: 'Produk' },
                      { value: 'bahan_baku', label: 'Bahan Baku' },
                      { value: 'pengeluaran', label: 'Pengeluaran' },
                    ]}
                  />
                  <Input placeholder="Deskripsi" value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="gap-1"><Check className="w-4 h-4" /> Simpan</Button>
                  <Button onClick={resetForm} size="sm" variant="outline" className="gap-1"><X className="w-4 h-4" /> Batal</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        <div className="grid gap-2">
          {filtered.map((k, i) => (
            <motion.div
              key={k.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between bg-card/50 border border-border/30 rounded-xl px-4 py-3 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{k.nama}</p>
                  <p className="text-xs text-muted-foreground">{k.deskripsi}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${tipeColors[k.tipe]}`}>
                  {tipeLabels[k.tipe]}
                </span>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(k)} className="h-8 w-8">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(k.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MasterKategori;
