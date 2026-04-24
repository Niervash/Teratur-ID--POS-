import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Plus, Trash2, Package, Edit2, X, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { rawMaterials as initialMaterials, RawMaterial } from '@/data/mockData';
import { toast } from 'sonner';

const Expenses = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>(initialMaterials);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pricePerUnit: 0,
    unit: 'Kg',
    category: 'bahan_baku' as RawMaterial['category'],
    description: '',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const categories = [
    { value: 'bahan_baku', label: 'Bahan Baku (HPP)', isHpp: true },
    { value: 'tenaga_kerja', label: 'Tenaga Kerja Langsung (HPP)', isHpp: true },
    { value: 'overhead', label: 'Overhead Produksi (HPP)', isHpp: true },
    { value: 'operasional', label: 'Beban Operasional', isHpp: false },
    { value: 'administrasi', label: 'Beban Administrasi', isHpp: false },
  ];

  const units = ['Kg', 'Gram', 'Liter', 'Pcs', 'Paket', 'Hari', 'Bulan'];

  const handleAdd = () => {
    if (!formData.name || formData.pricePerUnit <= 0) {
      toast.error('Mohon isi nama dan harga dengan benar');
      return;
    }

    const newMaterial: RawMaterial = {
      id: Date.now().toString(),
      ...formData,
      stockCurrent: 0,
    };

    setMaterials(prev => [...prev, newMaterial]);
    setFormData({ name: '', pricePerUnit: 0, unit: 'Kg', category: 'bahan_baku', description: '' });
    setIsAdding(false);
    toast.success('Data pengeluaran berhasil ditambahkan!');
  };

  const handleDelete = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    toast.success('Data pengeluaran berhasil dihapus');
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const isHppCategory = (category: string) => {
    return categories.find(c => c.value === category)?.isHpp || false;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold mb-1">Data Pengeluaran</h1>
            <p className="text-muted-foreground">
              Kelola bahan baku dan biaya operasional untuk perhitungan HPP
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Data
          </Button>
        </motion.div>

        {/* HPP Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 border-l-4 border-l-primary"
        >
          <h3 className="font-semibold text-primary mb-2">
            📊 Informasi HPP (Harga Pokok Penjualan)
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            HPP adalah total biaya yang dikeluarkan untuk memproduksi atau memperoleh barang yang dijual. HPP dihitung dari:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Biaya bahan baku yang digunakan untuk produksi</li>
            <li>Biaya tenaga kerja langsung (jika ada)</li>
            <li>Biaya overhead produksi lainnya</li>
          </ul>
        </motion.div>

        {/* Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Tambah Data Pengeluaran</h3>
                <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Nama Bahan/Biaya
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Biji Kopi Arabica"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Harga per Unit (IDR)
                  </label>
                  <Input
                    type="number"
                    value={formData.pricePerUnit || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: parseInt(e.target.value) || 0 }))}
                    placeholder="Masukkan harga"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Jenis Satuan
                  </label>
                  <Select
                    value={formData.unit}
                    onChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                    className="w-full h-10"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-4 h-4" />}
                    options={units.map(unit => ({ value: unit, label: unit }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Kategori Biaya
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(value) => setFormData(prev => ({ ...prev, category: value as RawMaterial['category'] }))}
                    className="w-full h-10"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-4 h-4" />}
                    options={categories.map(cat => ({ value: cat.value, label: cat.label }))}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Keterangan
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Keterangan tambahan (opsional)"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAdd} className="gap-2">
                  <Check className="w-4 h-4" />
                  Simpan
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Batal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Materials List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Daftar Data Pengeluaran</h3>
          </div>

          {materials.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada data pengeluaran</p>
              <p className="text-sm text-muted-foreground">
                Silakan tambah data pengeluaran untuk mulai mencatat biaya operasional.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
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
                  {materials.map((material, index) => (
                    <motion.tr
                      key={material.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border hover:bg-secondary/30"
                    >
                      <td className="py-3 px-4 font-medium">{material.name}</td>
                      <td className="py-3 px-4 text-right number-display">
                        {formatCurrency(material.pricePerUnit)}
                      </td>
                      <td className="py-3 px-4 text-center text-muted-foreground">
                        {material.unit}
                      </td>
                      <td className="py-3 px-4 text-sm">{getCategoryLabel(material.category)}</td>
                      <td className="py-3 px-4 text-center">
                        {isHppCategory(material.category) ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            Ya
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Tidak
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {material.description || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
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

export default Expenses;
