import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, MoreVertical, CheckCircle, XCircle, Phone, Mail, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DemoRequest {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  createdAt: string;
}

const DemoRequests = () => {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('teratur_demo_requests') || '[]');
    setRequests(storedRequests);
  }, []);

  const updateStatus = (id: string, newStatus: DemoRequest['status']) => {
    const updated = requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updated);
    localStorage.setItem('teratur_demo_requests', JSON.stringify(updated));
    toast.success(`Status permintaan berhasil diperbarui menjadi ${newStatus}`);
  };

  const filteredRequests = requests.filter(req => 
    req.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Demo</h1>
          <p className="text-muted-foreground">Kelola pendaftaran demo aplikasi dari calon klien.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari bisnis, nama, atau email..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Daftar Permintaan</CardTitle>
            <CardDescription>Total {filteredRequests.length} permintaan masuk.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Bisnis</TableHead>
                    <TableHead className="min-w-[150px]">Kontak</TableHead>
                    <TableHead className="min-w-[120px]">Tanggal</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Tidak ada permintaan demo ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium whitespace-nowrap">{req.businessName}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                              <Building2 className="w-3 h-3" /> {req.ownerName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs flex items-center gap-1 whitespace-nowrap">
                              <Mail className="w-3 h-3" /> {req.email}
                            </span>
                            <span className="text-xs flex items-center gap-1 whitespace-nowrap">
                              <Phone className="w-3 h-3" /> {req.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs whitespace-nowrap">
                            {new Date(req.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              req.status === 'pending' ? 'secondary' : 
                              req.status === 'approved' ? 'success' : 
                              req.status === 'rejected' ? 'destructive' : 'outline'
                            }
                            className="capitalize"
                          >
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateStatus(req.id, 'contacted')}>
                                <Phone className="w-4 h-4 mr-2" /> Tandai Hubungi
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(req.id, 'approved')}>
                                <CheckCircle className="w-4 h-4 mr-2 text-success" /> Setujui Demo
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(req.id, 'rejected')}>
                                <XCircle className="w-4 h-4 mr-2 text-destructive" /> Tolak
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DemoRequests;
