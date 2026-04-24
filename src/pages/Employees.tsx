import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, Trash2, Users, X, Check, UserCircle, 
  Calendar, CreditCard, Award, Clock,
  MoreVertical, Edit2, Search, CheckCircle2,
  AlertCircle, Download, FileText, TrendingUp,
  Mail, Phone, MapPin, Briefcase, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

export interface Employee {
  id: string;
  name: string;
  position: string;
  dailyWage: number;
  monthlyWage: number;
  wageType: 'daily' | 'monthly';
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  performance: number;
  attendance: number;
}

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ahmad Barista',
    position: 'Barista',
    dailyWage: 150000,
    monthlyWage: 3900000,
    wageType: 'daily',
    department: 'Produksi',
    phone: '081234567890',
    email: 'ahmad@teratur.id',
    joinDate: '2024-01-15',
    status: 'active',
    performance: 92,
    attendance: 24,
  },
  {
    id: '2',
    name: 'Siti Kasir',
    position: 'Kasir',
    dailyWage: 120000,
    monthlyWage: 3120000,
    wageType: 'daily',
    department: 'Operasional',
    phone: '081234567891',
    email: 'siti@teratur.id',
    joinDate: '2024-02-01',
    status: 'active',
    performance: 88,
    attendance: 22,
  },
];

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isKPIOpen, setIsKPIOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);

  // New Employee Form State
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Produksi',
    dailyWage: 0,
    email: '',
    phone: '',
    password: '', // Added password field
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleAddEmployee = () => {
    if (!formData.name || !formData.position || !formData.email || !formData.password) {
      toast.error("Mohon lengkapi data (Nama, Email, Jabatan, & Password)!");
      return;
    }

    // 1. Create Employee Object for the Table
    const employeeId = Date.now().toString();
    const newEmp: Employee = {
      id: employeeId,
      name: formData.name,
      position: formData.position,
      department: formData.department,
      dailyWage: formData.dailyWage,
      monthlyWage: formData.dailyWage * 26,
      wageType: 'daily',
      phone: formData.phone,
      email: formData.email,
      joinDate: formData.joinDate,
      status: 'active',
      performance: 0,
      attendance: 0
    };

    // 2. Create User Account for Login
    const newUserAccount = {
      id: employeeId,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.position.toLowerCase().includes('kasir') ? 'cashier' : 'manager'
    };

    // Save to System Users
    const existingUsers = JSON.parse(localStorage.getItem('teratur_users') || '[]');
    if (existingUsers.some((u: any) => u.email === formData.email)) {
      toast.error("Email sudah terdaftar di sistem!");
      return;
    }
    
    localStorage.setItem('teratur_users', JSON.stringify([...existingUsers, newUserAccount]));

    // Update Local UI State
    setEmployees(prev => [newEmp, ...prev]);
    setIsAdding(false);
    
    // Reset Form
    setFormData({
      name: '', position: '', department: 'Produksi',
      dailyWage: 0, email: '', phone: '', password: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    
    toast.success(`${newEmp.name} berhasil terdaftar sebagai ${newUserAccount.role.toUpperCase()}!`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleDelete = () => {
    if (employeeToDelete) {
      setEmployees(prev => prev.filter(e => e.id !== employeeToDelete.id));
      toast.success(`Data karyawan ${employeeToDelete.name} berhasil dihapus`);
      setEmployeeToDelete(null);
    }
  };

  const handlePublishSchedule = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Mengirim jadwal ke WhatsApp karyawan...',
        success: 'Jadwal berhasil dipublikasikan!',
        error: 'Gagal mengirim jadwal.'
      }
    );
  };

  const handleExport = () => {
    toast.info('Mengekspor data karyawan...');
    setTimeout(() => {
      toast.success('Data karyawan berhasil diekspor (PDF)');
    }, 2000);
  };

  const handleDownloadSlip = (name: string) => {
    toast.info(`Menyiapkan Slip Gaji: ${name}`);
    setTimeout(() => toast.success(`Slip gaji ${name} berhasil diunduh (PDF)`), 1500);
  };

  const handleProcessPayroll = () => {
    setIsProcessingPayroll(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Menghitung lembur dan bonus...',
        success: 'Payroll bulan April berhasil difinalisasi!',
        error: 'Gagal memproses gaji.',
        finally: () => setIsProcessingPayroll(false)
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Karyawan</h1>
            <p className="text-muted-foreground">Kelola SDM, operasional shift, dan performa tim Teratur.</p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="gap-2 h-11 px-6 shadow-lg shadow-primary/20 rounded-xl font-bold">
            <Plus className="w-4 h-4" /> Tambah Karyawan
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card/50 border border-border/50 p-1 rounded-2xl backdrop-blur-sm">
            <TabsTrigger value="list" className="rounded-xl gap-2 px-6">Daftar</TabsTrigger>
            <TabsTrigger value="shifts" className="rounded-xl gap-2 px-6">Shifts</TabsTrigger>
            <TabsTrigger value="payroll" className="rounded-xl gap-2 px-6">Payroll</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-xl gap-2 px-6">KPI</TabsTrigger>
          </TabsList>

          {/* TAB: DAFTAR KARYAWAN */}
          <TabsContent value="list" className="space-y-6 outline-none">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari karyawan..." 
                className="pl-9 bg-card/40 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map((e) => (
                <Card key={e.id} className="bg-card border-border/30 rounded-3xl p-6 hover:shadow-xl hover:border-primary/20 transition-all group overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {e.name.charAt(0)}
                    </div>
                    <Badge variant={e.status === 'active' ? 'success' : 'secondary'} className="rounded-full">
                      {e.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{e.name}</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-6">{e.position}</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 rounded-xl h-10 gap-2 text-xs font-bold"
                      onClick={() => { setSelectedEmployee(e); setIsDetailOpen(true); }}
                    >
                      <UserCircle className="w-4 h-4" /> Detail
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-xl h-10 w-10 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(e.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB: JADWAL SHIFT */}
          <TabsContent value="shifts" className="space-y-6 outline-none">
            <Card className="border-border/30 bg-card/50 rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-secondary/20">
                <CardTitle className="text-lg">Jadwal Kerja Tim</CardTitle>
                <Button size="sm" className="rounded-xl gap-2 h-9" onClick={handlePublishSchedule}>
                  <Calendar className="w-4 h-4" /> Publikasi Jadwal
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30 bg-secondary/10">
                        <th className="py-4 px-6 text-left">Nama</th>
                        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => <th key={d} className="py-4 text-center">{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(e => (
                        <tr key={e.id} className="border-b border-border/10">
                          <td className="py-4 px-6 font-bold">{e.name}</td>
                          {[1,2,3,4,5,6,7].map(d => (
                            <td key={d} className="py-4 text-center">
                              <Badge variant={d > 5 ? 'secondary' : 'outline'} className="text-[10px]">{d > 5 ? 'OFF' : 'PAGI'}</Badge>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: PENGGAJIAN */}
          <TabsContent value="payroll" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-border/30 bg-card/50 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-secondary/20">
                  <CardTitle className="text-lg">Payroll Tracker</CardTitle>
                  <Button size="sm" className="rounded-xl" onClick={handleProcessPayroll} disabled={isProcessingPayroll}>
                    {isProcessingPayroll ? 'Processing...' : 'Proses Semua Gaji'}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/10 text-muted-foreground uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-4 px-6 text-left">Karyawan</th>
                        <th className="py-4 text-center">Kehadiran</th>
                        <th className="py-4 px-6 text-right">Total Gaji</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(e => (
                        <tr key={e.id} className="border-b border-border/10">
                          <td className="py-4 px-6 font-bold">{e.name}</td>
                          <td className="py-4 text-center">{e.attendance}/26</td>
                          <td className="py-4 px-6 text-right font-black text-primary">{formatCurrency(e.monthlyWage)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              <Card className="border-border/30 bg-card/50 rounded-3xl">
                <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Download Slip Gaji</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {employees.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl group hover:bg-primary/5 transition-all">
                      <span className="text-xs font-bold">{e.name}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary" onClick={() => handleDownloadSlip(e.name)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: KPI */}
          <TabsContent value="performance" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employees.map(e => (
                <Card key={e.id} className="border-border/30 bg-card/50 rounded-3xl p-6">
                  <div className="flex justify-between mb-6">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{e.name.charAt(0)}</div>
                      <div><p className="font-bold text-sm">{e.name}</p><p className="text-[10px] text-muted-foreground uppercase font-bold">{e.position}</p></div>
                    </div>
                    <div className="text-right"><p className="text-[10px] text-muted-foreground font-bold uppercase">KPI Score</p><p className="text-xl font-black text-primary">{e.performance}%</p></div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="space-y-1.5"><div className="flex justify-between text-[10px] font-bold"><span>PRODUKTIVITAS</span><span>{e.performance}%</span></div><Progress value={e.performance} className="h-1.5" /></div>
                    <div className="space-y-1.5"><div className="flex justify-between text-[10px] font-bold"><span>ATTENDANCE</span><span>{(e.attendance/26*100).toFixed(0)}%</span></div><Progress value={(e.attendance/26*100)} className="h-1.5" /></div>
                  </div>
                  <Button variant="outline" className="w-full rounded-xl gap-2 h-10 text-xs font-bold" onClick={() => { setSelectedEmployee(e); setIsKPIOpen(true); }}>
                    <Star className="w-3.5 h-3.5" /> Berikan Feedback KPI
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* DIALOG: DETAIL KARYAWAN */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedEmployee && (
            <div className="relative">
              <div className="h-24 bg-primary/10" />
              <div className="px-8 pb-8 -mt-10">
                <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-primary shadow-lg mb-4 text-2xl font-bold">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold mb-1">{selectedEmployee.name}</h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-6">{selectedEmployee.position}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 bg-secondary/30 rounded-2xl flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" /><div className="min-w-0"><p className="text-[9px] font-bold text-muted-foreground uppercase">Email</p><p className="text-xs font-bold truncate">{selectedEmployee.email}</p></div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-2xl flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" /><div className="min-w-0"><p className="text-[9px] font-bold text-muted-foreground uppercase">Telepon</p><p className="text-xs font-bold">{selectedEmployee.phone}</p></div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-2xl flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" /><div className="min-w-0"><p className="text-[9px] font-bold text-muted-foreground uppercase">Departemen</p><p className="text-xs font-bold">{selectedEmployee.department}</p></div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-2xl flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" /><div className="min-w-0"><p className="text-[9px] font-bold text-muted-foreground uppercase">Kantor</p><p className="text-xs font-bold text-success">Pusat</p></div>
                  </div>
                </div>
                <Button className="w-full rounded-2xl h-12 font-bold" onClick={() => setIsDetailOpen(false)}>Kembali</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG: TAMBAH KARYAWAN */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader><DialogTitle className="text-2xl">Tambah Karyawan</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Nama Lengkap</label>
              <Input placeholder="Contoh: Budi Santoso" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Jabatan</label>
                <Input placeholder="Barista / Kasir" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Gaji Harian</label>
                <Input type="number" placeholder="Rp" value={formData.dailyWage || ''} onChange={(e) => setFormData({...formData, dailyWage: parseInt(e.target.value) || 0})} className="rounded-xl h-11" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Email</label>
                <Input type="email" placeholder="email@teratur.id" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Login Password</label>
                <Input type="password" placeholder="Min 6 Karakter" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="rounded-xl h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Telepon</label>
              <Input placeholder="0812xxxx" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="rounded-xl h-11" />
            </div>
            <Button className="w-full h-12 rounded-2xl font-bold text-lg mt-4" onClick={handleAddEmployee}>Simpan Data Karyawan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG: FEEDBACK KPI */}
      <Dialog open={isKPIOpen} onOpenChange={setIsKPIOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl">
          <DialogHeader><DialogTitle className="text-xl">Penilaian KPI & Feedback</DialogTitle></DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold">{selectedEmployee.name.charAt(0)}</div>
                <p className="font-bold">{selectedEmployee.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Rating Kinerja (1-100)</label>
                <Input type="number" defaultValue={selectedEmployee.performance} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Catatan Evaluasi</label>
                <Textarea placeholder="Berikan catatan perbaikan atau apresiasi..." className="rounded-2xl min-h-[100px]" />
              </div>
              <Button className="w-full rounded-2xl h-12 font-bold" onClick={() => { toast.success(`Feedback berhasil dikirim ke ${selectedEmployee.name}`); setIsKPIOpen(false); }}>Kirim Feedback</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Employees;
