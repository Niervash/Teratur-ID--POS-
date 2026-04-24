import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { QrCode, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exportToCSV } from '@/lib/exportUtils';

interface QRISTransaction {
  id: string;
  noRef: string;
  tanggal: string;
  pelanggan: string;
  total: number;
  status: 'berhasil' | 'pending' | 'gagal';
}

const QRIS = () => {
  const [transactions] = useLocalStorage<QRISTransaction[]>('teratur_qris', [
    { id: '1', noRef: 'QRIS-001', tanggal: '2025-01-20 10:30', pelanggan: 'Customer A', total: 50000, status: 'berhasil' },
    { id: '2', noRef: 'QRIS-002', tanggal: '2025-01-20 11:00', pelanggan: 'Customer B', total: 75000, status: 'berhasil' },
    { id: '3', noRef: 'QRIS-003', tanggal: '2025-01-20 12:15', pelanggan: 'Customer C', total: 30000, status: 'pending' },
    { id: '4', noRef: 'QRIS-004', tanggal: '2025-01-19 14:00', pelanggan: 'Customer D', total: 45000, status: 'gagal' },
    { id: '5', noRef: 'QRIS-005', tanggal: '2025-01-19 15:30', pelanggan: 'Customer E', total: 120000, status: 'berhasil' },
  ]);
  const [search, setSearch] = useState('');

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);
  const statusColor = (s: string) => s === 'berhasil' ? 'bg-green-500/10 text-green-600' : s === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive';

  const filtered = transactions.filter(t => t.noRef.toLowerCase().includes(search.toLowerCase()) || t.pelanggan.toLowerCase().includes(search.toLowerCase()));
  const totalBerhasil = filtered.filter(t => t.status === 'berhasil').reduce((a, b) => a + b.total, 0);
  const countBerhasil = filtered.filter(t => t.status === 'berhasil').length;
  const countPending = filtered.filter(t => t.status === 'pending').length;

  const handleExport = () => {
    exportToCSV(filtered.map(t => ({ 'No Ref': t.noRef, Tanggal: t.tanggal, Pelanggan: t.pelanggan, Total: t.total, Status: t.status })), 'qris_transactions');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">QRIS</h1><p className="text-muted-foreground text-sm">Kelola pembayaran melalui QRIS</p></div>
          <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Total Berhasil</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalBerhasil)}</p></div>
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Transaksi Berhasil</p><p className="text-2xl font-bold text-foreground">{countBerhasil}</p></div>
          <div className="bg-card rounded-xl border border-border/50 p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-warning">{countPending}</p></div>
        </div>

        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Cari transaksi..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>

        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/50 bg-muted/30"><th className="text-left p-3 text-sm font-medium text-muted-foreground">No. Referensi</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Tanggal</th><th className="text-left p-3 text-sm font-medium text-muted-foreground">Pelanggan</th><th className="text-right p-3 text-sm font-medium text-muted-foreground">Total</th><th className="text-center p-3 text-sm font-medium text-muted-foreground">Status</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium text-foreground">{t.noRef}</td>
                  <td className="p-3 text-sm text-muted-foreground">{t.tanggal}</td>
                  <td className="p-3 text-sm text-foreground">{t.pelanggan}</td>
                  <td className="p-3 text-sm text-right font-medium text-foreground">{formatCurrency(t.total)}</td>
                  <td className="p-3 text-center"><Badge className={statusColor(t.status)}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">Tidak ada transaksi QRIS</div>}
        </div>
      </motion.div>
    </Layout>
  );
};

export default QRIS;
