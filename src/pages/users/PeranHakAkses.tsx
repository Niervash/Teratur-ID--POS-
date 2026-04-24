import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Users, Lock, ChevronRight, Plus, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const roles = [
  { 
    id: 'manager', 
    name: 'Manager', 
    description: 'Akses penuh ke semua fitur outlet.',
    count: 2,
    permissions: ['Master Data', 'Persediaan', 'Laporan Keuangan', 'Manajemen Karyawan', 'Pengaturan']
  },
  { 
    id: 'cashier', 
    name: 'Kasir', 
    description: 'Akses terbatas untuk transaksi dan laporan harian.',
    count: 5,
    permissions: ['Transaksi', 'Laporan Penjualan', 'Input Pengeluaran']
  },
  { 
    id: 'supervisor', 
    name: 'Supervisor', 
    description: 'Akses transaksi dan manajemen stok.',
    count: 1,
    permissions: ['Transaksi', 'Persediaan', 'Laporan Penjualan']
  },
];

const allPermissions = [
  { category: 'Penjualan', items: ['Buat Transaksi', 'Retur Penjualan', 'Lihat Daftar Penjualan', 'Akses QRIS'] },
  { category: 'Persediaan', items: ['Lihat Stok', 'Stok Opname', 'Penyesuaian Stok', 'Mutasi Barang'] },
  { category: 'Keuangan', items: ['Input Pengeluaran', 'Lihat Laporan Keuangan', 'Analisis Harga'] },
  { category: 'Sistem', items: ['Manajemen Karyawan', 'Konfigurasi Outlet', 'Log Aktivitas'] },
];

const PeranHakAkses = () => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const handleSave = () => {
    toast.success(`Hak akses untuk peran ${selectedRole.name} berhasil diperbarui!`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Peran & Hak Akses</h1>
            <p className="text-muted-foreground">Kelola tingkat keamanan dan izin akses karyawan Anda.</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Peran Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Role List */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Daftar Peran</h3>
            {roles.map((role) => (
              <Card 
                key={role.id} 
                className={`cursor-pointer transition-all border-border/30 hover:border-primary/50 ${selectedRole.id === role.id ? 'ring-2 ring-primary bg-primary/5' : 'bg-card/50'}`}
                onClick={() => setSelectedRole(role)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedRole.id === role.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">{role.name}</h4>
                      <Badge variant="secondary" className="text-[10px]">{role.count} User</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{role.description}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedRole.id === role.id ? 'rotate-90' : ''}`} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-8">
            <Card className="border-border/30 bg-card/30 backdrop-blur-xl h-full">
              <CardHeader className="border-b border-border/10 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Izin Akses: {selectedRole.name}</CardTitle>
                    <CardDescription>Konfigurasi fitur apa saja yang dapat diakses oleh peran ini.</CardDescription>
                  </div>
                  <Button onClick={handleSave} className="gap-2 shadow-lg shadow-primary/20">
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {allPermissions.map((group) => (
                    <div key={group.category} className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <Lock className="w-3 h-3" /> {group.category}
                      </h4>
                      <div className="space-y-3">
                        {group.items.map((permission) => (
                          <div key={permission} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/5 hover:bg-secondary/30 transition-colors">
                            <span className="text-sm font-medium">{permission}</span>
                            <Switch defaultChecked={selectedRole.permissions.includes(permission) || selectedRole.id === 'manager'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PeranHakAkses;
