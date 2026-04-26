import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Receipt, User, Lock, LogIn, ArrowLeft, 
  UserCircle, Building2, MapPin, Phone, 
  Calendar, ChevronRight, ChevronLeft, 
  Mail, ShieldCheck, Zap, Briefcase, 
  CheckCircle2, Store, Utensils, Percent, 
  LayoutDashboard, ShoppingBag, Crown, Rocket,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from 'antd';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const businessTypes = [
  'Restoran', 'Kafe / Coffee Shop', 'Bakery', 'Catering', 'Food Truck', 'Minuman / Bar'
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [regStep, setRegStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // FORM STATES
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });

  const [businessData, setBusinessData] = useState({
    name: '', type: '', phone: '', address: '', hasTax: true, tableCount: '10'
  });

  const handleNextStep = () => {
    if (regStep === 1) {
      if (!formData.name || !formData.email || formData.password.length < 6) {
        toast.error("Lengkapi data diri (Password min. 6 karakter)");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Konfirmasi password tidak cocok");
        return;
      }
    }
    if (regStep === 2) {
      if (!businessData.name || !businessData.type || !businessData.phone) {
        toast.error("Lengkapi profil bisnis Anda");
        return;
      }
    }
    setRegStep(prev => prev + 1);
  };

  const handleBackStep = () => setRegStep(prev => prev - 1);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsFinishing(true);
      setTimeout(() => {
        // Calculate trial expiry (14 days from now)
        const trialDays = 14;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + trialDays);

        const newUser = { 
          id: Date.now().toString(), 
          ...formData, 
          role: 'manager',
          subscription: {
            status: 'trial',
            plan: 'Free Trial',
            trialEndsAt: expiryDate.toISOString(),
            isActive: true
          },
          business: { ...businessData }
        };
        
        const users = JSON.parse(localStorage.getItem('teratur_users') || '[]');
        users.push(newUser);
        localStorage.setItem('teratur_users', JSON.stringify(users));
        
        login(newUser);
        toast.success("Bisnis Anda berhasil didaftarkan!");
        navigate('/dashboard');
      }, 2500);
    }, 1000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = JSON.parse(localStorage.getItem('teratur_users') || '[]');
    const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      login(user);
      toast.success(`Selamat datang kembali, ${user.name}`);
      // Redirect based on internal role
      if (user.role === 'superadmin') navigate('/superadmin/demo-requests');
      else if (user.role === 'cashier') navigate('/transactions');
      else navigate('/dashboard');
    } else {
      toast.error("Email atau password salah");
    }
    setIsLoading(false);
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8"
        >
          <Rocket className="w-10 h-10 text-primary animate-bounce" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2 text-foreground">Menyiapkan Workspace...</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Sedang mengonfigurasi database keuangan untuk <span className="font-bold text-primary">{businessData.name}</span>. Hampir selesai!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-sans">
      
      {/* LEFT PRESENTATION (Branding) */}
      <div className="hidden lg:flex lg:w-[35%] bg-card border-r border-border/50 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/Teratur_logo.png" alt="Teratur Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-primary">TERATUR.ID</h1>
          </Link>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold leading-tight">Bangun Bisnis F&B yang Modern & Terukur.</h2>
              <p className="text-muted-foreground">Platform all-in-one untuk manajemen operasional, karyawan, dan finansial.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Store, title: "Manajemen Outlet", desc: "Kelola satu atau banyak cabang dalam satu dashboard." },
                { icon: ShieldCheck, title: "Keamanan Level Bank", desc: "Data transaksi dan finansial Anda terjamin aman." },
                { icon: LayoutDashboard, title: "Analisis Profit", desc: "Dapatkan laporan laba rugi real-time setiap hari." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 inline-flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
             <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">System Operational</span>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2026 TERATUR.ID Smart Technologies</p>
        </div>
      </div>

      {/* RIGHT FORM (Login/Register) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:bg-slate-50/30 dark:lg:bg-transparent relative">
        
        {/* MOBILE HEADER (Only visible on mobile) */}
        <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex items-center justify-between z-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/Teratur_logo.png" alt="Teratur Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-black tracking-tighter text-primary">TERATUR.ID</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Beranda
          </Link>
        </div>

        <motion.div layout className="w-full max-w-[480px] mt-12 lg:mt-0">
          
          {/* Stepper UI for Registration */}
          {!isLogin && (
            <div className="flex items-center justify-center gap-4 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 border-2 ${
                    regStep === s 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/40 scale-110' 
                      : regStep > s 
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-card border-border text-muted-foreground'
                  }`}>
                    {regStep > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                  </div>
                  {s < 3 && <div className={`w-10 h-[3px] rounded-full transition-all duration-500 ${regStep > s ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="bg-card border border-border/50 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                {isLogin ? "Selamat Datang" : 
                 regStep === 1 ? "Buat Akun Manager" : 
                 regStep === 2 ? "Detail Bisnis" : "Pengaturan Awal"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin ? "Kelola dashboard bisnis Anda sekarang." : 
                 regStep === 1 ? "Langkah awal membangun sistem Teratur." : 
                 regStep === 2 ? "Informasi ini akan muncul di struk belanja." : "Konfigurasi standar operasional kasir."}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Bisnis</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <Input type="email" placeholder="nama@bisnis.id" className="h-12 pl-11 rounded-2xl bg-secondary/30 focus:bg-background transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <Input type="password" placeholder="••••••••" className="h-12 pl-11 rounded-2xl bg-secondary/30 focus:bg-background transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-2xl font-bold text-base mt-4 shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all" disabled={isLoading}>
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Masuk ke Dashboard"}
                  </Button>
                </motion.form>
              ) : (
                <motion.div key={`step-${regStep}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                  {/* STEP 1: PERSONAL (Account Creator) */}
                  {regStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Nama Lengkap Pemilik</label>
                        <Input placeholder="E.g. Budi Santoso" className="h-12 rounded-2xl bg-secondary/30" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Email Bisnis Aktif</label>
                        <Input type="email" placeholder="nama@email.com" className="h-12 rounded-2xl bg-secondary/30" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
                          <Input type="password" placeholder="••••••" className="h-12 rounded-2xl bg-secondary/30" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Konfirmasi</label>
                          <Input type="password" placeholder="••••••" className="h-12 rounded-2xl bg-secondary/30" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: BUSINESS ENTITY */}
                  {regStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Nama Brand / Bisnis</label>
                        <Input placeholder="E.g. Kedai Kopi Teratur" className="h-12 rounded-2xl bg-secondary/30" value={businessData.name} onChange={(e) => setBusinessData({...businessData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Kategori Bisnis</label>
                        <Select 
                          className="w-full h-12"
                          dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                          suffixIcon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          placeholder="Pilih Kategori"
                          value={businessData.type || undefined}
                          onChange={(value) => setBusinessData({...businessData, type: value})}
                          options={businessTypes.map(t => ({ value: t, label: t }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Nomor WA Bisnis</label>
                        <Input placeholder="0812xxxx" className="h-12 rounded-2xl bg-secondary/30" value={businessData.phone} onChange={(e) => setBusinessData({...businessData, phone: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: INITIAL SETUP */}
                  {regStep === 3 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Alamat Lengkap</label>
                        <Input placeholder="E.g. Jl. Sudirman No. 12" className="h-12 rounded-2xl bg-secondary/30" value={businessData.address} onChange={(e) => setBusinessData({...businessData, address: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Jumlah Meja</label>
                          <Input type="number" className="h-12 rounded-2xl bg-secondary/30" value={businessData.tableCount} onChange={(e) => setBusinessData({...businessData, tableCount: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground ml-1 mb-1 block uppercase tracking-wider text-center">Pajak PB1 (10%)</label>
                          <button onClick={() => setBusinessData({...businessData, hasTax: !businessData.hasTax})} className={`w-full h-12 rounded-2xl border flex items-center justify-center gap-2 transition-all font-bold text-xs ${businessData.hasTax ? 'bg-success/5 border-success/50 text-success' : 'bg-secondary/50 border-border text-muted-foreground'}`}>
                            <Percent className="w-4 h-4" /> {businessData.hasTax ? "AKTIF" : "NON-AKTIF"}
                          </button>
                        </div>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
                         <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                         <p className="text-[10px] text-primary/80 font-medium leading-relaxed">
                          Dengan mendaftar, Anda otomatis menjadi <b>Owner/Admin Utama</b> dan menyetujui Ketentuan Layanan Teratur.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {regStep > 1 && (
                      <Button variant="outline" className="h-12 rounded-2xl px-6 border-border" onClick={handleBackStep}>
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    )}
                    <Button className="flex-1 h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px]" onClick={regStep === 3 ? handleRegisterSubmit : handleNextStep} disabled={isLoading}>
                      {regStep === 3 ? "Buka Bisnis Saya" : "Lanjutkan"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                {isLogin ? "Ingin membuka bisnis baru?" : "Sudah memiliki akun?"}
                <button onClick={() => { setIsLogin(!isLogin); setRegStep(1); }} className="ml-2 font-black text-primary hover:underline">
                  {isLogin ? "Daftar Gratis" : "Masuk"}
                </button>
              </p>
            </div>
          </div>

          {/* Quick Access Badges (For Testing Only) */}
          {isLogin && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { id: 'sa', label: 'Internal Developer', icon: Zap, roles: 'superadmin', color: 'hover:text-blue-500' },
                { id: 'm', label: 'Owner Demo', icon: Crown, roles: 'manager', color: 'hover:text-amber-500' },
                { id: 'c', label: 'Cashier Demo', icon: ShoppingBag, roles: 'cashier', color: 'hover:text-green-500' }
              ].map(d => (
                <button key={d.id} onClick={() => { login({ id: d.id, name: d.label, role: d.roles as any, email: 'demo@teratur.id' }); navigate(d.roles === 'superadmin' ? '/superadmin/demo-requests' : d.roles === 'cashier' ? '/transactions' : '/dashboard'); }} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-[10px] font-bold text-muted-foreground transition-all hover:shadow-md ${d.color} hover:border-current`}>
                  <d.icon className="w-3.5 h-3.5" /> {d.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
