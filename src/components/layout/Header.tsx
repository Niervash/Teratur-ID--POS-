import { motion } from 'framer-motion';
import { 
  Calendar, TrendingUp, DollarSign, Bell, Search, 
  ChevronDown, Menu, PanelLeftClose, PanelLeft,
  User, Settings, LogOut, Info, AlertTriangle,
  CheckCircle2, Clock, Shield
} from 'lucide-react';
import { kpiData, dailyData } from '@/data/mockData';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HeaderProps {
  onOpenMobile?: () => void;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Header = ({ onOpenMobile, isCollapsed, onToggleSidebar }: HeaderProps) => {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'hari' | 'bulan'>('hari');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Berhasil keluar");
  };

  const todayRevenue = dailyData[dailyData.length - 1]?.revenue ?? 0;
  const monthlyRevenue = kpiData.totalRevenue;

  // Mock notifications based on role
  const notifications = [
    { id: 1, title: 'Stok Rendah', description: 'Biji Kopi Arabika tersisa 2kg', type: 'warning', roles: ['manager', 'cashier'] },
    { id: 2, title: 'Transaksi Baru', description: 'Pesanan #1092 berhasil dibayar', type: 'success', roles: ['manager', 'cashier'] },
    { id: 3, title: 'Laporan Mingguan', description: 'Laporan keuangan minggu lalu sudah siap', type: 'info', roles: ['manager'] },
    { id: 4, title: 'Sistem Update', description: 'Teratur v0.1.1 akan dirilis besok', type: 'info', roles: ['manager', 'cashier', 'superadmin'] },
  ].filter(n => n.roles.includes(user?.role || ''));

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-16 border-b border-border/30 bg-background/60 backdrop-blur-2xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40"
    >
      <div className="flex items-center gap-3">
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={onOpenMobile} className="mr-1">
            <Menu className="w-5 h-5" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar} 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </Button>
        )}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 border border-border/30 text-sm text-muted-foreground w-64">
          <Search className="w-4 h-4" />
          <span>Cari...</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setPeriod(period === 'hari' ? 'bulan' : 'hari')}>
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center hidden lg:flex group-hover:bg-success/20 transition-colors">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
            <div className="text-right sm:text-left">
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider">
                Revenue {period === 'hari' ? 'Hari Ini' : 'Bulan Ini'}
              </p>
              <p className="text-xs md:text-sm font-bold">
                {formatCurrency(period === 'hari' ? todayRevenue : monthlyRevenue)}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>

        <div className="w-px h-8 bg-border/30 hidden sm:block" />

        {/* NOTIFICATIONS DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl border border-border/30 hover:bg-secondary/50 transition-all">
              <Bell className="w-4 h-4 text-muted-foreground" />
              {notifications.length > 0 && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary border-2 border-background" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
            <DropdownMenuLabel className="px-3 py-2 text-sm font-bold">Notifikasi Teratur</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex gap-3 p-3 rounded-xl cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                    n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
                     n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold leading-none mb-1">{n.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{n.description}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-muted-foreground italic">Belum ada notifikasi baru</p>
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-[10px] font-bold text-primary uppercase tracking-widest cursor-pointer py-2">
              Lihat Semua Notifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role || 'Guest'}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 mt-1">
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-xs font-bold leading-none">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-3 p-2.5 rounded-xl cursor-pointer" onClick={() => navigate('/settings')}>
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Profil Saya</span>
            </DropdownMenuItem>
            
            {user?.role === 'manager' && (
              <DropdownMenuItem className="gap-3 p-2.5 rounded-xl cursor-pointer" onClick={() => navigate('/settings/config')}>
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pengaturan Bisnis</span>
              </DropdownMenuItem>
            )}

            {user?.role === 'superadmin' && (
              <DropdownMenuItem className="gap-3 p-2.5 rounded-xl cursor-pointer" onClick={() => navigate('/superadmin/health')}>
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Admin Panel</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="gap-3 p-2.5 rounded-xl cursor-pointer">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Log Aktivitas</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-3 p-2.5 rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};
