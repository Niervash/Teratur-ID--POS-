import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Trash2, Package, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { rawMaterials as initialMaterials, RawMaterial } from '@/data/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const categories = [
  { value: 'bahan_baku', label: 'Bahan Baku (HPP)', isHpp: true },
  { value: 'tenaga_kerja', label: 'Tenaga Kerja Langsung (HPP)', isHpp: true },
  { value: 'overhead', label: 'Overhead Produksi (HPP)', isHpp: true },
  { value: 'operasional', label: 'Beban Operasional', isHpp: false },
  { value: 'administrasi', label: 'Beban Administrasi', isHpp: false },
];

const DaftarPengeluaran = () => {
  const [materials, setMaterials] = useLocalStorage<RawMaterial[]>('teratur_expenses', initialMaterials);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  const getCategoryLabel = (category: string) =>
    categories.find(c => c.value === category)?.label || category;

  const isHppCategory = (category: string) =>
    categories.find(c => c.value === category)?.isHpp || false;

  const handleDelete = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    toast.success('Data pengeluaran berhasil dihapus');
  };

  const filtered = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalHpp = filtered.filter(m => isHppCategory(m.category)).reduce((sum, m) => sum + m.pricePerUnit, 0);
  const totalNonHpp = filtered.filter(m => !isHppCategory(m.category)).reduce((sum, m) => sum + m.pricePerUnit, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Daftar Pengeluaran</h1>
          <p className="text-muted-foreground">Lihat dan kelola semua data pengeluaran</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total Item</p>
            <p className="text-2xl font-bold">{filtered.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total HPP</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalHpp)}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Total Non-HPP</p>
            <p className="text-2xl font-bold">{formatCurrency(totalNonHpp)}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pengeluaran..."
              className="pl-9"
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(value) => setFilterCategory(value)}
            className="w-full md:w-48 h-10"
            dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
            suffixIcon={<ChevronDown className="w-4 h-4" />}
            options={[
              { value: 'all', label: 'Semua Kategori' },
              ...categories.map(cat => ({ value: cat.value, label: cat.label }))
            ]}
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Tidak ada data pengeluaran</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nama Item</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Harga/Unit</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Satuan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kategori</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">HPP</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Keterangan</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((material, index) => (
                    <motion.tr
                      key={material.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-t border-border hover:bg-secondary/30"
                    >
                      <td className="py-3 px-4 font-medium">{material.name}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(material.pricePerUnit)}</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">{material.unit}</td>
                      <td className="py-3 px-4 text-sm">{getCategoryLabel(material.category)}</td>
                      <td className="py-3 px-4 text-center">
                        {isHppCategory(material.category) ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">Ya</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Tidak</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{material.description || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDelete(material.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default DaftarPengeluaran;
