import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { AlertTriangle, Plus, Trash2, Pencil, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from 'antd';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { products } from '@/data/mockData';

interface DefectItem {
  id: string;
  productName: string;
  qty: number;
  reason: string;
  date: string;
  status: 'pending' | 'written_off' | 'returned';
}

const defaultDefecta: DefectItem[] = [
  { id: '1', productName: 'Nasi Goreng Spesial', qty: 3, reason: 'Bahan basi', date: '2024-01-15', status: 'written_off' },
  { id: '2', productName: 'Es Teh Manis', qty: 5, reason: 'Kemasan rusak', date: '2024-01-16', status: 'pending' },
];

const statusMap = { pending: 'Menunggu', written_off: 'Dihapuskan', returned: 'Dikembalikan' };
const statusColor = { pending: 'bg-yellow-500/10 text-yellow-600', written_off: 'bg-red-500/10 text-red-600', returned: 'bg-green-500/10 text-green-600' };

const Defecta = () => {
  const [items, setItems] = useLocalStorage<DefectItem[]>('teratur_defecta', defaultDefecta);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ productName: '', qty: '', reason: '', status: 'pending' as DefectItem['status'] });

  const handleSave = () => {
    if (!form.productName || !form.qty) { toast.error('Lengkapi data'); return; }
    const newItem: DefectItem = {
      id: Date.now().toString(), productName: form.productName, qty: parseInt(form.qty) || 0,
      reason: form.reason, date: new Date().toISOString().split('T')[0], status: form.status,
    };
    setItems(prev => [...prev, newItem]);
    toast.success('Data defecta ditambahkan');
    setIsAdding(false);
    setForm({ productName: '', qty: '', reason: '', status: 'pending' });
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Data dihapus');
  };

  const handleStatusChange = (id: string, status: DefectItem['status']) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    toast.success('Status diperbarui');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Defecta</h1>
              <p className="text-muted-foreground text-sm">Kelola barang rusak atau cacat</p>
            </div>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)}><Plus className="w-4 h-4 mr-2" />{isAdding ? 'Batal' : 'Tambah'}</Button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Card className="p-4 mb-6 space-y-3">
                <Select
                  showSearch
                  value={form.productName}
                  onChange={value => setForm(f => ({ ...f, productName: value }))}
                  placeholder="Pilih Produk"
                  className="w-full h-10"
                  dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                  suffixIcon={<ChevronDown className="w-4 h-4" />}
                  options={products.map(p => ({ value: p.name, label: `${p.emoji} ${p.name}` }))}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Jumlah" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
                  <Input placeholder="Alasan" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
                </div>
                <Button onClick={handleSave} className="w-full">Simpan</Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{item.productName}</h3>
                    <Badge className={`text-[10px] ${statusColor[item.status]}`}>{statusMap[item.status]}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Qty: {item.qty} | {item.reason} | {item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={item.status}
                    onChange={value => handleStatusChange(item.id, value as DefectItem['status'])}
                    className="w-32 h-8"
                    size="small"
                    dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                    suffixIcon={<ChevronDown className="w-3 h-3" />}
                    options={[
                      { value: 'pending', label: 'Menunggu' },
                      { value: 'written_off', label: 'Dihapuskan' },
                      { value: 'returned', label: 'Dikembalikan' },
                    ]}
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Defecta;
