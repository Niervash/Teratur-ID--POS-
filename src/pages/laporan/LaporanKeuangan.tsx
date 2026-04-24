import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  TrendingUp, TrendingDown, DollarSign, 
  Receipt, Wallet, Calendar, Download,
  ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const LaporanKeuangan = () => {
  const financialData = {
    revenue: 125000000,
    cogs: 45000000, // Cost of Goods Sold (HPP)
    grossProfit: 80000000,
    expenses: {
      salary: 15000000,
      rent: 5000000,
      utility: 3000000,
      marketing: 2000000,
    },
    get totalExpenses() {
      return this.expenses.salary + this.expenses.rent + this.expenses.utility + this.expenses.marketing;
    },
    get netProfit() {
      return this.grossProfit - this.totalExpenses;
    }
  };

  const formatCurrency = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laba Rugi (P&L)</h1>
            <p className="text-muted-foreground text-sm">Analisis mendalam profitabilitas bisnis Anda bulan ini.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-11"><Calendar className="w-4 h-4 mr-2" /> April 2026</Button>
            <Button className="rounded-xl h-11 gap-2 shadow-lg shadow-primary/20"><Download className="w-4 h-4" /> Cetak Laporan</Button>
          </div>
        </div>

        {/* TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/30 bg-card rounded-3xl shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="font-bold uppercase text-[10px] tracking-widest">Total Pendapatan</CardDescription>
              <CardTitle className="text-3xl font-black text-foreground">{formatCurrency(financialData.revenue)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-success text-xs font-bold gap-1">
                <ArrowUpRight className="w-4 h-4" /> +15.4% vs bln lalu
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card rounded-3xl shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="font-bold uppercase text-[10px] tracking-widest">Total HPP (Bahan Baku)</CardDescription>
              <CardTitle className="text-3xl font-black text-error">{formatCurrency(financialData.cogs)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={36} className="h-1.5 bg-error/10" />
              <p className="text-[10px] text-muted-foreground mt-2 font-medium">36% dari total pendapatan</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5 rounded-3xl shadow-xl border-2">
            <CardHeader className="pb-2">
              <CardDescription className="font-bold uppercase text-[10px] tracking-widest text-primary">Laba Bersih (Net Profit)</CardDescription>
              <CardTitle className="text-3xl font-black text-primary">{formatCurrency(financialData.netProfit)}</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center text-primary text-xs font-bold gap-1">
                <TrendingUp className="w-4 h-4" /> Profit Margin: {((financialData.netProfit/financialData.revenue)*100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DETAILED BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-border/30 bg-card rounded-[32px] overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border/30">
              <CardTitle className="text-lg">Rincian Pengeluaran Operasional</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { label: 'Gaji Karyawan', value: financialData.expenses.salary, color: 'bg-blue-500' },
                { label: 'Sewa Tempat', value: financialData.expenses.rent, color: 'bg-purple-500' },
                { label: 'Listrik & Air', value: financialData.expenses.utility, color: 'bg-amber-500' },
                { label: 'Marketing', value: financialData.expenses.marketing, color: 'bg-pink-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-muted-foreground">{item.label}</span>
                    <span className="font-black text-foreground">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${(item.value/financialData.totalExpenses)*100}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/30 bg-card rounded-[32px] overflow-hidden flex flex-col justify-center items-center p-12 text-center border-dashed">
             <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <PieChartIcon className="w-10 h-10" />
             </div>
             <h3 className="text-xl font-bold mb-2">Visualisasi Laba Rugi</h3>
             <p className="text-sm text-muted-foreground mb-8">Fitur chart interaktif sedang disinkronkan dengan data transaksi harian Anda.</p>
             <Button variant="secondary" className="rounded-xl">Lihat Analisis AI</Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LaporanKeuangan;
