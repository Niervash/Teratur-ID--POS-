import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { rawMaterials } from '@/data/mockData';

const AnalisisHarga = () => {
  // Mock price fluctuation data for top materials
  const priceHistory = [
    { bulan: 'Jan', beras: 14000, ayam: 38000, minyak: 18000, telur: 28000, gula: 16000 },
    { bulan: 'Feb', beras: 14500, ayam: 39000, minyak: 17500, telur: 29000, gula: 16200 },
    { bulan: 'Mar', beras: 14200, ayam: 37500, minyak: 18500, telur: 27500, gula: 15800 },
    { bulan: 'Apr', beras: 15000, ayam: 40000, minyak: 19000, telur: 30000, gula: 16500 },
    { bulan: 'Mei', beras: 14800, ayam: 39500, minyak: 18200, telur: 29500, gula: 16300 },
    { bulan: 'Jun', beras: 15200, ayam: 41000, minyak: 18800, telur: 31000, gula: 16800 },
  ];

  const materials = [
    { key: 'beras', name: 'Beras', color: 'hsl(var(--primary))' },
    { key: 'ayam', name: 'Ayam', color: 'hsl(var(--accent))' },
    { key: 'minyak', name: 'Minyak Goreng', color: 'hsl(var(--warning))' },
    { key: 'telur', name: 'Telur', color: 'hsl(var(--destructive))' },
    { key: 'gula', name: 'Gula', color: 'hsl(var(--chart-4))' },
  ];

  // Calculate price changes
  const priceChanges = materials.map(m => {
    const first = priceHistory[0][m.key as keyof typeof priceHistory[0]] as number;
    const last = priceHistory[priceHistory.length - 1][m.key as keyof typeof priceHistory[0]] as number;
    const change = ((last - first) / first * 100).toFixed(1);
    return { ...m, currentPrice: last, change: Number(change) };
  });

  const formatCurrency = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analisis Harga</h1>
          <p className="text-muted-foreground text-sm">Bandingkan harga supplier dan analisis fluktuasi harga bahan baku</p>
        </div>

        {/* Price Change Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {priceChanges.map((m, i) => (
            <motion.div key={m.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card/50 border border-border/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{m.name}</p>
              <p className="text-sm font-bold text-foreground">{formatCurrency(m.currentPrice)}<span className="text-xs text-muted-foreground">/kg</span></p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${m.change >= 0 ? 'text-destructive' : 'text-primary'}`}>
                {m.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.change >= 0 ? '+' : ''}{m.change}%
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card/50 border border-border/30 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-primary" /> Tren Harga 6 Bulan Terakhir
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${(v / 1000).toFixed(0)}rb`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} formatter={(v: number, name: string) => [formatCurrency(v), name]} />
              <Legend />
              {materials.map(m => (
                <Line key={m.key} type="monotone" dataKey={m.key} name={m.name} stroke={m.color} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* All Materials Price Table */}
        <div className="bg-card/50 border border-border/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Daftar Harga Bahan Baku Saat Ini
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Bahan</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Kategori</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Harga/Unit</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Stok</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Nilai Stok</th>
                </tr>
              </thead>
              <tbody>
                {rawMaterials.map(m => (
                  <tr key={m.id} className="border-b border-border/10 hover:bg-secondary/10">
                    <td className="py-2 px-3 text-foreground font-medium">{m.name}</td>
                    <td className="py-2 px-3 text-muted-foreground capitalize">{m.category.replace('_', ' ')}</td>
                    <td className="py-2 px-3 text-right text-foreground">{formatCurrency(m.pricePerUnit)}/{m.unit}</td>
                    <td className="py-2 px-3 text-right text-muted-foreground">{m.stockCurrent} {m.unit}</td>
                    <td className="py-2 px-3 text-right text-foreground font-medium">{formatCurrency(m.pricePerUnit * m.stockCurrent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalisisHarga;
