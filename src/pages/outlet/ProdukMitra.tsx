import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ProdukMitraItem {
  id: string;
  name: string;
  outlet: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
}

const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const ProdukMitra = () => {
  const [produkList] = useLocalStorage<ProdukMitraItem[]>('teratur_produk_mitra', [
    { id: '1', name: 'Kopi Susu Gula Aren', outlet: 'Outlet Cabang 1', price: 22000, stock: 50, unit: 'cup', category: 'Minuman' },
    { id: '2', name: 'Matcha Latte', outlet: 'Outlet Cabang 1', price: 28000, stock: 30, unit: 'cup', category: 'Minuman' },
    { id: '3', name: 'Croissant', outlet: 'Outlet Cabang 2', price: 18000, stock: 20, unit: 'pcs', category: 'Makanan' },
    { id: '4', name: 'Es Teh Manis', outlet: 'Outlet Cabang 3', price: 8000, stock: 100, unit: 'cup', category: 'Minuman' },
    { id: '5', name: 'Roti Bakar', outlet: 'Outlet Cabang 2', price: 15000, stock: 25, unit: 'pcs', category: 'Makanan' },
  ]);
  const [search, setSearch] = useState('');

  const filtered = produkList.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.outlet.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Daftar Produk Mitra</h1>
          <p className="text-muted-foreground">Lihat produk dari outlet mitra</p>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Cari produk atau outlet..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.outlet}</p>
                  </div>
                </div>
                <Badge variant="secondary">{p.category}</Badge>
              </div>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-muted-foreground">Harga: <span className="text-foreground font-medium">{formatCurrency(p.price)}</span></span>
                <span className="text-muted-foreground">Stok: <span className="text-foreground font-medium">{p.stock} {p.unit}</span></span>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Tidak ada produk mitra</p>}
      </motion.div>
    </Layout>
  );
};

export default ProdukMitra;
