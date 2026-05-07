import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Check, Info, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { rawMaterials as initialMaterials, RawMaterial } from '@/data/mockData';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const categories = [
  { value: 'bahan_baku', label: 'Bahan Baku (HPP)' },
  { value: 'tenaga_kerja', label: 'Tenaga Kerja Langsung (HPP)' },
  { value: 'overhead', label: 'Overhead Produksi (HPP)' },
  { value: 'operasional', label: 'Beban Operasional' },
  { value: 'administrasi', label: 'Beban Administrasi' },
];

const units = ['Kg', 'Gram', 'Liter', 'Pcs', 'Paket', 'Hari', 'Bulan'];

const InputPengeluaran = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    pricePerUnit: 0,
    unit: 'Kg',
    category: 'bahan_baku' as RawMaterial['category'],
    description: '',
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await api.get<any[]>('/inventory/ingredients');
        const formatted = data.map(m => ({
          ...m,
          stock: Number(m.stock),
          minStock: Number(m.minStock),
          avgCost: Number(m.avgCost),
          pricePerUnit: Number(m.avgCost),
          stockCurrent: Number(m.stock),
        }));
        setMaterials(formatted);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      }
    };
    fetchMaterials();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || formData.pricePerUnit <= 0) {
      toast.error('Mohon isi nama dan harga dengan benar');
      return;
    }

    try {
      const id = `exp-${Date.now()}`;
      
      // 1. Record General Expense
      await api.post('/expenses', {
        id,
        name: formData.name,
        amount: formData.pricePerUnit,
        unit: formData.unit,
        category: formData.category,
        description: formData.description
      });

      // 2. Sync to Ingredients if HPP related
      if (['bahan_baku', 'tenaga_kerja', 'overhead'].includes(formData.category)) {
        try {
          await api.post('/inventory/ingredients', {
            id: `ing-${Date.now()}`,
            name: formData.name,
            unit: formData.unit,
            stock: 0,
            minStock: 0,
            avgCost: formData.pricePerUnit,
          });
        } catch (ingErr) {
          console.error('Failed to sync to ingredients, but expense was recorded');
        }
      }

      // 3. Update Local UI State
      const newMaterial: RawMaterial = {
        id,
        ...formData,
        stockCurrent: 0,
      };

      const updated = [newMaterial, ...materials];
      setMaterials(updated);
      localStorage.setItem('teratur_expenses', JSON.stringify(updated));
      
      setFormData({ name: '', pricePerUnit: 0, unit: 'Kg', category: 'bahan_baku', description: '' });
      toast.success('Pengeluaran berhasil dicatat!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan pengeluaran');
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Input Pengeluaran</h1>
          <p className="text-muted-foreground">Tambah data pengeluaran baru</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 border-l-4 border-l-primary"
        >
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-primary mb-1">Info HPP</h3>
              <p className="text-sm text-muted-foreground">
                Kategori Bahan Baku, Tenaga Kerja, dan Overhead akan dihitung sebagai HPP.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Nama Bahan/Biaya <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Biji Kopi Arabica"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Harga per Unit (IDR) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.pricePerUnit || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: parseInt(e.target.value) || 0 }))}
                  placeholder="Masukkan harga"
                />
              </div>
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

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Keterangan
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Keterangan tambahan (opsional)"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full gap-2">
              <Check className="w-4 h-4" />
              Simpan Pengeluaran
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default InputPengeluaran;
