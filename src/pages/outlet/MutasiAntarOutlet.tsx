import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ArrowRight, Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Mutasi {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  fromOutlet: string;
  toOutlet: string;
  date: string;
  status: 'in_transit' | 'completed';
}

const MutasiAntarOutlet = () => {
  const [mutasiList] = useLocalStorage<Mutasi[]>('teratur_mutasi_history', [
    { id: '1', productName: 'Biji Kopi Arabica', quantity: 5, unit: 'kg', fromOutlet: 'Outlet Pusat', toOutlet: 'Outlet Cabang 1', date: '2025-01-20', status: 'completed' },
    { id: '2', productName: 'Susu UHT', quantity: 10, unit: 'liter', fromOutlet: 'Outlet Cabang 2', toOutlet: 'Outlet Pusat', date: '2025-01-19', status: 'in_transit' },
    { id: '3', productName: 'Gula Aren', quantity: 3, unit: 'kg', fromOutlet: 'Outlet Pusat', toOutlet: 'Outlet Cabang 2', date: '2025-01-18', status: 'completed' },
    { id: '4', productName: 'Cup Plastik 16oz', quantity: 200, unit: 'pcs', fromOutlet: 'Outlet Cabang 1', toOutlet: 'Outlet Cabang 3', date: '2025-01-17', status: 'completed' },
  ]);
  const [search, setSearch] = useState('');

  const filtered = mutasiList.filter(m => m.productName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mutasi Antar Outlet</h1>
          <p className="text-muted-foreground">Riwayat perpindahan stok antar outlet</p>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="space-y-3">
          {filtered.map(m => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{m.productName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>{m.fromOutlet}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{m.toOutlet}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.quantity} {m.unit} • {m.date}</p>
                  </div>
                </div>
                <Badge variant={m.status === 'completed' ? 'default' : 'secondary'}>
                  {m.status === 'completed' ? 'Selesai' : 'Dalam Perjalanan'}
                </Badge>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Tidak ada data mutasi</p>}
        </div>
      </motion.div>
    </Layout>
  );
};

export default MutasiAntarOutlet;
