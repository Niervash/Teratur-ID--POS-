import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  History, Search, Filter, Download, 
  User, Activity, ShieldAlert, CheckCircle2,
  Trash2, Edit3, PlusCircle, LogIn
} from 'lucide-react';

const mockLogs = [
  { id: 1, user: 'Ahmad Manager', action: 'Update Harga Produk', target: 'Espresso', time: '2024-04-21 10:05:12', ip: '192.168.1.10', type: 'update' },
  { id: 2, user: 'Siti Kasir', action: 'Login ke Sistem', target: 'Terminal 01', time: '2024-04-21 08:00:05', ip: '192.168.1.15', type: 'access' },
  { id: 3, user: 'Budi Kitchen', action: 'Stok Opname', target: 'Biji Kopi Arabika', time: '2024-04-21 07:45:30', ip: '192.168.1.12', type: 'create' },
  { id: 4, user: 'Ahmad Manager', action: 'Hapus Data Karyawan', target: 'Ex-Employee', time: '2024-04-20 16:30:45', ip: '192.168.1.10', type: 'delete' },
  { id: 5, user: 'Siti Kasir', action: 'Void Transaksi', target: 'TRX-99021', time: '2024-04-20 14:20:10', ip: '192.168.1.15', type: 'delete' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'update': return <Edit3 className="w-3.5 h-3.5 text-primary" />;
    case 'delete': return <Trash2 className="w-3.5 h-3.5 text-destructive" />;
    case 'create': return <PlusCircle className="w-3.5 h-3.5 text-success" />;
    case 'access': return <LogIn className="w-3.5 h-3.5 text-warning" />;
    default: return <Activity className="w-3.5 h-3.5 text-muted-foreground" />;
  }
};

const LogAktivitas = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Log Aktivitas Karyawan</h1>
            <p className="text-muted-foreground">Audit trail lengkap untuk semua tindakan yang dilakukan di sistem.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Download Audit Log
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/30">
            <CardContent className="pt-6">
              <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Total Aktivitas Hari Ini</div>
              <div className="text-2xl font-bold">142</div>
              <p className="text-[10px] text-success font-medium mt-1">↑ 12% dari kemarin</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="pt-6">
              <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Tindakan Kritikal (Void/Hapus)</div>
              <div className="text-2xl font-bold text-destructive">8</div>
              <p className="text-[10px] text-muted-foreground mt-1">Memerlukan perhatian manager</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="pt-6">
              <div className="text-xs font-bold uppercase text-muted-foreground mb-1">User Paling Aktif</div>
              <div className="text-2xl font-bold">Siti Kasir</div>
              <p className="text-[10px] text-muted-foreground mt-1">45 tindakan hari ini</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="pt-6">
              <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Status Keamanan</div>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-lg font-bold text-success">Secure</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Semua IP terdaftar</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/30 bg-card/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-bold">Audit Trail Sistem</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Cari user atau tindakan..." className="pl-9 h-9" />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="font-bold">Waktu</TableHead>
                    <TableHead className="font-bold">Pengguna</TableHead>
                    <TableHead className="font-bold">Tindakan</TableHead>
                    <TableHead className="font-bold">Objek/Target</TableHead>
                    <TableHead className="font-bold">IP Address</TableHead>
                    <TableHead className="font-bold">Tipe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="text-xs font-medium font-mono text-muted-foreground">
                        {log.time}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {log.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-bold text-sm">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{log.action}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold border-border/40">
                          {log.target}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {log.ip}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${
                            log.type === 'delete' ? 'bg-destructive/10' : 
                            log.type === 'update' ? 'bg-primary/10' : 
                            log.type === 'create' ? 'bg-success/10' : 'bg-warning/10'
                          }`}>
                            {getIcon(log.type)}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {log.type}
                          </span>
                        </div>
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

export default LogAktivitas;
