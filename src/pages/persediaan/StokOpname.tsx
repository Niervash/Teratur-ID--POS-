import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ClipboardCheck, Save, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { products } from '@/data/mockData';

interface OpnameItem {
  productId: string;
  productName: string;
  emoji: string;
  unit: string;
  systemStock: number;
  physicalStock: number | null;
  difference: number;
  verified: boolean;
}

const StokOpname = () => {
  const initItems: OpnameItem[] = products.map(p => ({
    productId: p.id, productName: p.name, emoji: p.emoji, unit: p.unit,
    systemStock: p.stockCurrent, physicalStock: null, difference: 0, verified: false,
  }));

  const [items, setItems] = useLocalStorage<OpnameItem[]>('teratur_opname', initItems);
  const [lastSaved, setLastSaved] = useLocalStorage<string>('teratur_opname_date', '');

  const updatePhysical = (productId: string, val: string) => {
    const num = val === '' ? null : parseInt(val);
    setItems(prev => prev.map(i =>
      i.productId === productId ? { ...i, physicalStock: num, difference: num !== null ? num - i.systemStock : 0 } : i
    ));
  };

  const handleSave = () => {
    const unverified = items.filter(i => i.physicalStock === null);
    if (unverified.length > 0) { toast.error(`${unverified.length} produk belum diisi stok fisik`); return; }
    setItems(prev => prev.map(i => ({ ...i, verified: true })));
    setLastSaved(new Date().toLocaleString('id-ID'));
    toast.success('Stok opname berhasil disimpan!');
  };

  const handleReset = () => {
    setItems(initItems);
    toast.info('Data opname direset');
  };

  const totalDiff = items.reduce((s, i) => s + Math.abs(i.difference), 0);
  const verified = items.filter(i => i.verified).length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Stok Opname</h1>
              <p className="text-muted-foreground text-sm">Pengecekan stok fisik vs sistem {lastSaved && `• Terakhir: ${lastSaved}`}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Simpan</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Produk</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Terverifikasi</p>
            <p className="text-2xl font-bold text-green-600">{verified}/{items.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Selisih</p>
            <p className="text-2xl font-bold text-red-600">{totalDiff}</p>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Produk</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Stok Sistem</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Stok Fisik</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Selisih</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.productId} className="border-b border-border/50 hover:bg-secondary/10">
                    <td className="p-3 text-sm font-medium">{item.emoji} {item.productName}</td>
                    <td className="p-3 text-center text-sm">{item.systemStock} {item.unit}</td>
                    <td className="p-3 text-center">
                      <Input type="number" className="w-20 mx-auto text-center h-8 text-sm"
                        value={item.physicalStock ?? ''} onChange={e => updatePhysical(item.productId, e.target.value)} />
                    </td>
                    <td className={`p-3 text-center text-sm font-bold ${item.difference === 0 ? '' : item.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.physicalStock !== null ? (item.difference > 0 ? `+${item.difference}` : item.difference) : '-'}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={item.verified ? 'default' : 'outline'} className="text-[10px]">
                        {item.verified ? '✓ Verified' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default StokOpname;
