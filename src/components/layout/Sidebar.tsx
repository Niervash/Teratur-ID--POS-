import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  TrendingDown,
  Users,
  Leaf,
  Database,
  Tag,
  Ruler,
  Warehouse,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  UserCog,
  Shield,
  Activity,
  Building2,
  Wrench,
  HelpCircle,
  MessageCircle,
  History,
  LogOut,
  ClipboardList,
  RotateCcw,
  XCircle,
  QrCode,
  Fingerprint
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavGroup {
  id: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
  items?: NavItem[];
  path?: string;
}

const navGroups: NavGroup[] = [
  // === SUPER ADMIN menus ===
  {
    id: 'super-admin',
    icon: Shield,
    label: 'TERATUR.ID Admin',
    roles: ['superadmin'],
    items: [
      { icon: ClipboardList, label: 'Demo Requests', path: '/superadmin/demo-requests' },
      { icon: DollarSign, label: 'Subscriptions', path: '/superadmin/subscriptions' },
      { icon: Users, label: 'Manage Clients', path: '/superadmin/clients' },
      { icon: Activity, label: 'System Health', path: '/superadmin/health' },
    ]
  },
  // === CASHIER menus ===
  { 
    id: 'kasir',
    icon: Receipt, 
    label: 'Kasir', 
    path: '/transactions', 
    roles: ['cashier'] 
  },
  {
    id: 'penjualan',
    icon: ShoppingCart,
    label: 'Penjualan',
    roles: ['cashier'],
    items: [
      { icon: ClipboardList, label: 'Pesanan Penjualan', path: '/penjualan/pesanan' },
      { icon: BarChart3, label: 'Daftar Penjualan', path: '/penjualan/daftar' },
      { icon: RotateCcw, label: 'Retur Penjualan', path: '/penjualan/retur' },
      { icon: XCircle, label: 'Penjualan Tertolak', path: '/penjualan/tertolak' },
      { icon: QrCode, label: 'QRIS', path: '/penjualan/qris' },
    ]
  },
  {
    id: 'expenses-cashier',
    icon: TrendingDown,
    label: 'Pengeluaran',
    roles: ['cashier'],
    items: [
      { icon: Receipt, label: 'Input Pengeluaran', path: '/pengeluaran/input' },
      { icon: ClipboardList, label: 'Daftar Pengeluaran', path: '/pengeluaran/daftar' },
    ]
  },
  {
    id: 'membership',
    icon: Users,
    label: 'Member',
    path: '/members',
    roles: ['manager', 'cashier']
  },

  // === MANAGER menus ===
  {
    id: 'master-data',
    icon: Database,
    label: 'Master Data',
    roles: ['manager'],
    items: [
      { icon: Package, label: 'Master Produk', path: '/products' },
      { icon: Tag, label: 'Master Kategori', path: '/master/kategori' },
      { icon: Ruler, label: 'Master Satuan', path: '/master/satuan' },
      { icon: Warehouse, label: 'Master Gudang', path: '/master/gudang' },
    ]
  },
  {
    id: 'persediaan',
    icon: Package,
    label: 'Persediaan',
    roles: ['manager'],
    items: [
      { icon: Package, label: 'Daftar Produk', path: '/persediaan/produk' },
      { icon: Activity, label: 'Defecta', path: '/persediaan/defecta' },
      { icon: History, label: 'Stok Kadaluarsa', path: '/persediaan/kadaluarsa' },
      { icon: Warehouse, label: 'Stok Opname', path: '/persediaan/opname' },
      { icon: Wrench, label: 'Penyesuaian Stok', path: '/persediaan/penyesuaian' },
    ]
  },
  {
    id: 'expenses',
    icon: TrendingDown,
    label: 'Pengeluaran',
    roles: ['manager'],
    items: [
      { icon: Receipt, label: 'Input Pengeluaran', path: '/pengeluaran/input' },
      { icon: ClipboardList, label: 'Daftar Pengeluaran', path: '/pengeluaran/daftar' },
    ]
  },
  { 
    id: 'employees',
    icon: Users, 
    label: 'Karyawan', 
    roles: ['manager'],
    items: [
      { icon: Users, label: 'Daftar Karyawan', path: '/employees' },
      { icon: Fingerprint, label: 'Absensi Fingerprint', path: '/employees/absensi' },
      { icon: DollarSign, label: 'Komisi Penjualan', path: '/employees/komisi' },
    ]
  },
  {
    id: 'analisis',
    icon: TrendingUp,
    label: 'Analisis',
    roles: ['manager'],
    items: [
      { icon: BarChart3, label: 'Analisis Pareto', path: '/analisis/pareto' },
      { icon: ShoppingCart, label: 'Analisis Pembelian', path: '/analisis/pembelian' },
      { icon: DollarSign, label: 'Analisis Harga', path: '/analisis/harga' },
    ]
  },
  {
    id: 'laporan',
    icon: BarChart3,
    label: 'Laporan',
    roles: ['manager'],
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Receipt, label: 'Laporan Penjualan', path: '/laporan/penjualan' },
      { icon: ShoppingCart, label: 'Laporan Pembelian', path: '/laporan/pembelian' },
      { icon: Package, label: 'Laporan Persediaan', path: '/laporan/persediaan' },
      { icon: DollarSign, label: 'Laporan Keuangan', path: '/laporan/keuangan' },
    ]
  },
  {
    id: 'multi-outlet',
    icon: Building2,
    label: 'Multi Outlet',
    roles: ['manager'],
    items: [
      { icon: TrendingUp, label: 'Permintaan Mutasi', path: '/outlet/mutasi-request' },
      { icon: Warehouse, label: 'Mutasi Antar Outlet', path: '/outlet/mutasi' },
      { icon: Package, label: 'Daftar Produk Mitra', path: '/outlet/produk-mitra' },
      { icon: Building2, label: 'Daftar Outlet Mitra', path: '/outlet/outlet-mitra' },
    ]
  },
  {
    id: 'user-management',
    icon: UserCog,
    label: 'Manajemen Pengguna',
    roles: ['manager'],
    items: [
      { icon: Users, label: 'Daftar Pengguna', path: '/users' },
      { icon: Shield, label: 'Peran & Hak Akses', path: '/users/roles' },
      { icon: Activity, label: 'Log Aktivitas', path: '/users/log' },
    ]
  },
  { 
    id: 'ai-chat',
    icon: MessageSquare, 
    label: 'Chat AI', 
    path: '/chat', 
    roles: ['manager'] 
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Pengaturan',
    roles: ['manager'],
    items: [
      { icon: Building2, label: 'Profil Bisnis', path: '/settings' },
      { icon: Wrench, label: 'Konfigurasi', path: '/settings/config' },
    ]
  },
  {
    id: 'help',
    icon: HelpCircle,
    label: 'Pusat Bantuan',
    roles: ['manager'],
    items: [
      { icon: MessageCircle, label: 'Minta Bantuan', path: '/help/request' },
      { icon: History, label: 'Riwayat Update', path: '/help/updates' },
    ]
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle, isOpenMobile, onCloseMobile }: SidebarProps) => {
  const { user, logout, hasFeature } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const userRole = user?.role || 'cashier';
  
  const filteredGroups = navGroups.filter(group => {
    if (!group.roles.includes(userRole)) return false;
    if (userRole === 'superadmin') return true;
    const featureId = group.id === 'expenses-cashier' ? 'expenses' : group.id;
    return hasFeature(featureId);
  });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-card border-r border-border/30 shadow-xl">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
            <img src="/Teratur_logo.png" alt="Teratur Logo" className="w-full h-full object-contain" />
          </div>
          {(!isCollapsed || isMobile) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-bold text-foreground tracking-tight">TERATUR.ID</h1>
              <p className="text-[10px] text-muted-foreground">Smart Management v0.1.0</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {filteredGroups.map((group) => {
          if (group.path) {
            return (
              <NavLink
                key={group.id}
                to={group.path}
                onClick={isMobile ? onCloseMobile : undefined}
                end={group.path === '/transactions'}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all duration-200 group"
                activeClassName="bg-primary/10 text-foreground border border-primary/15"
              >
                <group.icon className="w-5 h-5 flex-shrink-0 group-hover:text-primary transition-colors" />
                {(!isCollapsed || isMobile) && <span className="text-sm font-medium">{group.label}</span>}
              </NavLink>
            );
          }

          const isOpen = openGroups[group.id] || false;
          return (
            <div key={group.id}>
              <button
                onClick={() => (isCollapsed && !isMobile) ? undefined : toggleGroup(group.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all duration-200 group"
              >
                <group.icon className="w-5 h-5 flex-shrink-0 group-hover:text-primary transition-colors" />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="text-sm font-medium flex-1 text-left">{group.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
              <AnimatePresence>
                {isOpen && (!isCollapsed || isMobile) && group.items && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-4 border-l border-border/30 space-y-0.5 py-1">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={isMobile ? onCloseMobile : undefined}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all duration-200 text-sm"
                          activeClassName="bg-primary/10 text-foreground"
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Trial Widget - Hidden on mobile if needed, but here kept for all */}
      {(!isCollapsed || isMobile) && user?.role === 'manager' && (
        <div className="px-4 mb-4">
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Masa Trial: 14 Hari</span>
            <Button size="sm" className="w-full h-8 text-[10px] font-bold">UPGRADE</Button>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-3 border-t border-border/30">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4" />
          {(!isCollapsed || isMobile) && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpenMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[280px] z-[101]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      className="fixed left-0 top-0 h-screen z-50 overflow-hidden"
    >
      {sidebarContent}
    </motion.aside>
  );
};
