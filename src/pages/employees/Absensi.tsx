import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Fingerprint, Search, Calendar as CalendarIcon, 
  CheckCircle2, XCircle, Clock, ArrowUpDown, Filter,
  Download, RefreshCw
} from 'lucide-react';
import { useState } from 'react';

const mockAbsensi = [
  { id: 1, name: 'Ahmad Barista', date: '2024-04-21', checkIn: '08:00:12', checkOut: '17:05:45', status: 'Hadir', device: 'Fingerprint-01', late: '0 min' },
  { id: 2, name: 'Siti Kasir', date: '2024-04-21', checkIn: '08:15:30', checkOut: '17:10:20', status: 'Terlambat', device: 'Fingerprint-01', late: '15 min' },
  { id: 3, name: 'Budi Kitchen', date: '2024-04-21', checkIn: '07:55:00', checkOut: '17:00:10', status: 'Hadir', device: 'Fingerprint-02', late: '0 min' },
  { id: 4, name: 'Dewi Waiter', date: '2024-04-21', checkIn: '08:05:10', checkOut: '17:02:30', status: 'Hadir', device: 'Fingerprint-01', late: '5 min' },
  { id: 5, name: 'Eko Barista', date: '2024-04-20', checkIn: '08:00:05', checkOut: '17:00:00', status: 'Hadir', device: 'Fingerprint-01', late: '0 min' },
];

const Absensi = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Absensi Karyawan</h1>
            <p className="text-muted-foreground">Monitor kehadiran karyawan secara real-time via Fingerprint.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full border border-success/20 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              FINGERPRINT CONNECTED
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Hadir</p>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="text-2xl font-bold">12 / 15</div>
              <p className="text-[10px] text-muted-foreground mt-1">Hari ini: 21 April 2024</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Terlambat</p>
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div className="text-2xl font-bold">2</div>
              <p className="text-[10px] text-muted-foreground mt-1">Rata-rata keterlambatan: 10m</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Izin / Sakit</p>
                <CalendarIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">1</div>
              <p className="text-[10px] text-muted-foreground mt-1">Berdasarkan pengajuan sistem</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Tanpa Keterangan</p>
                <XCircle className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-[10px] text-muted-foreground mt-1">Semua terjadwal terlacak</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/30 bg-card/30 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Log Kehadiran Fingerprint</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama karyawan..." 
                  className="pl-9 h-9 bg-background/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="font-bold">Karyawan</TableHead>
                    <TableHead className="font-bold">Tanggal</TableHead>
                    <TableHead className="font-bold">Jam Masuk</TableHead>
                    <TableHead className="font-bold">Jam Pulang</TableHead>
                    <TableHead className="font-bold">Keterangan</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Perangkat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAbsensi.map((log) => (
                    <TableRow key={log.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium">{log.name}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-success font-bold">
                          <Clock className="w-3 h-3" /> {log.checkIn}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" /> {log.checkOut}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.late !== '0 min' ? (
                          <Badge variant="outline" className="text-warning border-warning/30 bg-warning/5">
                            Terlambat {log.late}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Tepat Waktu</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'Hadir' ? 'success' : 'warning'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                          <Fingerprint className="w-3 h-3" /> {log.device}
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

export default Absensi;
