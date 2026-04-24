import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, TrendingUp, Users, Target,
  Download, Filter, ChevronRight, Award
} from 'lucide-react';

const mockKomisi = [
  { id: 1, name: 'Ahmad Barista', sales: 15000000, commission: 750000, target: 20000000, achievement: 75 },
  { id: 2, name: 'Siti Kasir', sales: 25000000, commission: 1250000, target: 20000000, achievement: 125 },
  { id: 3, name: 'Dewi Waiter', sales: 12000000, commission: 600000, target: 15000000, achievement: 80 },
  { id: 4, name: 'Eko Barista', sales: 18000000, commission: 900000, target: 20000000, achievement: 90 },
];

const Komisi = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Komisi Penjualan</h1>
            <p className="text-muted-foreground">Lacak performa penjualan dan komisi karyawan secara transparan.</p>
          </div>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Download Laporan Komisi
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Total Komisi Bulan Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Rp 3.500.000</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" /> +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-warning" /> Pencapaian Target Outlet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span>Rp 70.000.000 / Rp 100.000.000</span>
                <span className="font-bold">70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </CardContent>
          </Card>
          <Card className="border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-success" /> Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success font-bold">S</div>
                <div>
                  <p className="text-sm font-bold">Siti Kasir</p>
                  <p className="text-[10px] text-muted-foreground">125% Achievement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/30 bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Rincian Komisi Per Karyawan</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Filter Periode
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <TableHead className="font-bold">Karyawan</TableHead>
                    <TableHead className="font-bold text-right">Total Penjualan</TableHead>
                    <TableHead className="font-bold">Progress Target</TableHead>
                    <TableHead className="font-bold text-right">Komisi (5%)</TableHead>
                    <TableHead className="font-bold"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockKomisi.map((k) => (
                    <TableRow key={k.id}>
                      <TableCell className="font-bold">{k.name}</TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {k.sales.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span>{k.achievement}% Target</span>
                            <span className="font-bold text-primary">{k.achievement >= 100 ? 'PASSED' : ''}</span>
                          </div>
                          <Progress value={k.achievement} className={`h-1.5 ${k.achievement >= 100 ? 'bg-success/20' : ''}`} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="primary" className="bg-primary/10 text-primary border-primary/20 font-bold">
                          Rp {k.commission.toLocaleString('id-ID')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Komisi;
