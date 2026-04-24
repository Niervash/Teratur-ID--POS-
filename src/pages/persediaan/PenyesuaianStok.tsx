import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Wrench, Plus, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from 'antd';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { products } from '@/data/mockData';

interface Adjustment {
  id: string;
  productName: string;
  type: 'add' | 'subtract';
  qty: number;
  reason: string;
  date: string;
  by: string;
}

const defaultAdjustments: Adjustment[] = [
  { id: '1', productName: 'Nasi Goreng Spesial', type: 'add', qty: 10, reason: 'Koreksi stok opname', date: '2024-01-15', by: 'Manager' },
  { id: '2', productName: 'Es Teh Manis', type: 'subtract', qty: 5, reason: 'Barang rusak', date: '2024-01-16', by: 'Manager' },
];

const PenyesuaianStok = () => {
  const [items, setItems] = useLocalStorage<Adjustment[]>('teratur_adjustments', defaultAdjustments);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ productName: '', type: 'add' as 'add' | 'subtract', qty: '', reason: '' });

  const handleSave = () => {
    if (!form.productName || !form.qty || !form.reason) { toast.error('Lengkapi semua data'); return; }
    setItems(prev => [...prev, {
      id: Date.now().toString(), productName: form.productName, type: form.type,
      qty: parseInt(form.qty) || 0, reason: form.reason, date: new Date().toISOString().split('T')[0], by: 'Manager',
    }]);
    toast.success('Penyesuaian stok dicatat');
    setIsAdding(false);
    setForm({ productName: '', type: 'add', qty: '', reason: '' });
  };

  const totalAdd = items.filter(i => i.type === 'add').reduce((s, i) => s + i.qty, 0);
  const totalSub = items.filter(i => i.type === 'subtract').reduce((s, i) => s + i.qty, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Penyesuaian Stok</h1>
              <p className="text-muted-foreground text-sm">Sesuaikan jumlah stok secara manual</p>
            </div>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)}><Plus className="w-4 h-4 mr-2" />{isAdding ? 'Batal' : 'Tambah'}</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 border-green-500/20 bg-green-500/5">
            <p className="text-sm text-muted-foreground">Total Penambahan</p>
            <p className="text-2xl font-bold text-green-600">+{totalAdd}</p>
          </Card>
          <Card className="p-4 border-red-500/20 bg-red-500/5">
            <p className="text-sm text-muted-foreground">Total Pengurangan</p>
            <p className="text-2xl font-bold text-red-600">-{totalSub}</p>
          </Card>
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
                <div className="flex gap-2">
                  <Button variant={form.type === 'add' ? 'default' : 'outline'} size="sm" onClick={() => setForm(f => ({ ...f, type: 'add' }))}>
                    <ArrowUp className="w-3 h-3 mr-1" />Tambah
                  </Button>
                  <Button variant={form.type === 'subtract' ? 'default' : 'outline'} size="sm" onClick={() => setForm(f => ({ ...f, type: 'subtract' }))}>
                    <ArrowDown className="w-3 h-3 mr-1" />Kurangi
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Jumlah" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
                  <Input placeholder="Alasan penyesuaian" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
                </div>
                <Button onClick={handleSave} className="w-full">Simpan Penyesuaian</Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'add' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {item.type === 'add' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{item.productName}</h3>
                    <p className="text-xs text-muted-foreground">{item.reason} • {item.date} • {item.by}</p>
                  </div>
                </div>
                <Badge variant={item.type === 'add' ? 'default' : 'destructive'} className="text-xs">
                  {item.type === 'add' ? '+' : '-'}{item.qty}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PenyesuaianStok;
