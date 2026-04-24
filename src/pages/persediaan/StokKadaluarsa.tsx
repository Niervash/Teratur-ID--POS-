import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { products } from '@/data/mockData';

interface ExpiredItem {
  id: string;
  productName: string;
  batch: string;
  qty: number;
  expDate: string;
  status: 'expired' | 'near_expired' | 'safe';
}

const generateExpiredData = (): ExpiredItem[] => {
  const today = new Date();
  return products.map((p, i) => {
    const daysOffset = [- 5, 3, 15, 45, -2, 7, 30, 60][i % 8];
    const exp = new Date(today);
    exp.setDate(exp.getDate() + daysOffset);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      id: p.id,
      productName: p.name,
      batch: `BTH-${String(i + 1).padStart(3, '0')}`,
      qty: Math.floor(p.stockCurrent * 0.3),
      expDate: exp.toISOString().split('T')[0],
      status: diffDays < 0 ? 'expired' : diffDays <= 7 ? 'near_expired' : 'safe',
    };
  });
};

const statusLabel = { expired: 'Kadaluarsa', near_expired: 'Hampir Kadaluarsa', safe: 'Aman' };
const statusStyle = { expired: 'destructive' as const, near_expired: 'outline' as const, safe: 'secondary' as const };

const StokKadaluarsa = () => {
  const [items] = useLocalStorage<ExpiredItem[]>('teratur_expired', generateExpiredData());
  const [filter, setFilter] = useState<'all' | 'expired' | 'near_expired' | 'safe'>('all');

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
  const expiredCount = items.filter(i => i.status === 'expired').length;
  const nearCount = items.filter(i => i.status === 'near_expired').length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Stok Kadaluarsa</h1>
            <p className="text-muted-foreground text-sm">Pantau produk mendekati atau sudah kadaluarsa</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 border-red-500/20 bg-red-500/5">
            <p className="text-sm text-muted-foreground">Kadaluarsa</p>
            <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
          </Card>
          <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
            <p className="text-sm text-muted-foreground">Hampir Kadaluarsa</p>
            <p className="text-2xl font-bold text-yellow-600">{nearCount}</p>
          </Card>
          <Card className="p-4 border-green-500/20 bg-green-500/5">
            <p className="text-sm text-muted-foreground">Aman</p>
            <p className="text-2xl font-bold text-green-600">{items.length - expiredCount - nearCount}</p>
          </Card>
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'expired', 'near_expired', 'safe'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>
              {f === 'all' ? 'Semua' : statusLabel[f]}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={`p-4 flex items-center justify-between ${item.status === 'expired' ? 'border-red-500/30' : item.status === 'near_expired' ? 'border-yellow-500/30' : ''}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {item.status !== 'safe' && <AlertTriangle className={`w-4 h-4 ${item.status === 'expired' ? 'text-red-500' : 'text-yellow-500'}`} />}
                    <h3 className="font-semibold text-sm">{item.productName}</h3>
                    <Badge variant={statusStyle[item.status]} className="text-[10px]">{statusLabel[item.status]}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Batch: {item.batch} | Qty: {item.qty} | Exp: {item.expDate}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default StokKadaluarsa;
