import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { History, CheckCircle, Zap, Bug } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const updates = [
  { version: 'v2.4.0', date: '20 Januari 2025', type: 'feature', title: 'Multi Outlet', items: ['Permintaan mutasi stok antar outlet', 'Daftar produk & outlet mitra', 'Tracking status mutasi'] },
  { version: 'v2.3.0', date: '15 Januari 2025', type: 'feature', title: 'Laporan Lengkap', items: ['Laporan penjualan dengan chart', 'Laporan pembelian & persediaan', 'Export CSV & Excel'] },
  { version: 'v2.2.1', date: '10 Januari 2025', type: 'bugfix', title: 'Perbaikan Bug', items: ['Fix kalkulasi HPP', 'Fix tampilan mobile sidebar', 'Perbaikan performa chart'] },
  { version: 'v2.2.0', date: '5 Januari 2025', type: 'feature', title: 'Chat AI Template', items: ['Template pertanyaan otomatis', 'Analisis HPP & margin', 'Rekomendasi bisnis'] },
  { version: 'v2.1.0', date: '1 Januari 2025', type: 'improvement', title: 'Peningkatan UI', items: ['Redesign dashboard', 'Animasi sidebar', 'Dark mode optimization'] },
];

const typeIcon = (t: string) => t === 'feature' ? <Zap className="w-4 h-4" /> : t === 'bugfix' ? <Bug className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />;
const typeColor = (t: string) => t === 'feature' ? 'bg-primary/10 text-primary' : t === 'bugfix' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600';

const RiwayatUpdate = () => {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">Riwayat Update</h1><p className="text-muted-foreground text-sm">Lihat perubahan dan pembaruan sistem terbaru</p></div>

        <div className="space-y-4 max-w-3xl">
          {updates.map((u, i) => (
            <motion.div key={u.version} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={typeColor(u.type)}>{typeIcon(u.type)}<span className="ml-1">{u.type}</span></Badge>
                <h3 className="font-semibold text-foreground">{u.version} — {u.title}</h3>
                <span className="text-xs text-muted-foreground ml-auto">{u.date}</span>
              </div>
              <ul className="space-y-1">
                {u.items.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default RiwayatUpdate;
