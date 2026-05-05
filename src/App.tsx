import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useEffect, useState } from "react";
import { PWAManager } from "@/components/PWAManager";
import { DataInitializer } from "@/components/DataInitializer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Transactions from "./pages/Transactions";
import AIChat from "./pages/AIChat";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Expenses from "./pages/Expenses";
import InputPengeluaran from "./pages/pengeluaran/InputPengeluaran";
import DaftarPengeluaranPage from "./pages/pengeluaran/DaftarPengeluaran";
import Employees from "./pages/Employees";
import JadwalKerja from "./pages/employees/JadwalKerja";
import Members from "./pages/Members";
import Absensi from "./pages/employees/Absensi";
import Komisi from "./pages/employees/Komisi";
import NotFound from "./pages/NotFound";
import DaftarProduk from "./pages/persediaan/DaftarProduk";
import Defecta from "./pages/persediaan/Defecta";
import StokKadaluarsa from "./pages/persediaan/StokKadaluarsa";
import StokOpname from "./pages/persediaan/StokOpname";
import PenyesuaianStok from "./pages/persediaan/PenyesuaianStok";
import MasterKategori from "./pages/MasterKategori";
import MasterSatuan from "./pages/MasterSatuan";
import MasterGudang from "./pages/MasterGudang";
import AnalisisPareto from "./pages/AnalisisPareto";
import AnalisisPembelian from "./pages/AnalisisPembelian";
import AnalisisHarga from "./pages/AnalisisHarga";
import PermintaanMutasi from "./pages/outlet/PermintaanMutasi";
import MutasiAntarOutlet from "./pages/outlet/MutasiAntarOutlet";
import ProdukMitra from "./pages/outlet/ProdukMitra";
import OutletMitra from "./pages/outlet/OutletMitra";
import LaporanPenjualan from "./pages/laporan/LaporanPenjualan";
import LaporanPembelian from "./pages/laporan/LaporanPembelian";
import LaporanPersediaan from "./pages/laporan/LaporanPersediaan";
import LaporanKeuangan from "./pages/laporan/LaporanKeuangan";
import PesananPenjualan from "./pages/penjualan/PesananPenjualan";
import DaftarPenjualan from "./pages/penjualan/DaftarPenjualan";
import ReturPenjualan from "./pages/penjualan/ReturPenjualan";
import PenjualanTertolak from "./pages/penjualan/PenjualanTertolak";
import QRIS from "./pages/penjualan/QRIS";
import DaftarPengguna from "./pages/users/DaftarPengguna";
import PeranHakAkses from "./pages/users/PeranHakAkses";
import LogAktivitas from "./pages/users/LogAktivitas";
import Konfigurasi from "./pages/settings/Konfigurasi";
import MintaBantuan from "./pages/help/MintaBantuan";
import RiwayatUpdate from "./pages/help/RiwayatUpdate";
import DemoRequests from "./pages/SuperAdmin/DemoRequests";
import Subscriptions from "./pages/SuperAdmin/Subscriptions";
import Clients from "./pages/SuperAdmin/Clients";
import SystemHealth from "./pages/SuperAdmin/SystemHealth";

const queryClient = new QueryClient();

const AntdConfigWrapper = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setSetmounted] = useState(false);

  useEffect(() => {
    setSetmounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <ConfigProvider
      theme={{
        algorithm: resolvedTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#2F77B3', // Matching project primary
          borderRadius: 12,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Select: {
            controlHeight: 40,
            optionSelectedBg: 'rgba(47, 119, 179, 0.1)',
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataInitializer />
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AntdConfigWrapper>
        <TooltipProvider>
        <PWAManager />
        <Toaster />
        <Sonner position="top-center" closeButton richColors />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/superadmin/demo-requests" element={<ProtectedRoute roles={['superadmin']}><DemoRequests /></ProtectedRoute>} />
              <Route path="/superadmin/subscriptions" element={<ProtectedRoute roles={['superadmin']}><Subscriptions /></ProtectedRoute>} />
              <Route path="/superadmin/clients" element={<ProtectedRoute roles={['superadmin']}><Clients /></ProtectedRoute>} />
              <Route path="/superadmin/health" element={<ProtectedRoute roles={['superadmin']}><SystemHealth /></ProtectedRoute>} />
              
              {/* Dashboard - now under Laporan for manager */}
              <Route path="/dashboard" element={<ProtectedRoute roles={['manager']}><Index /></ProtectedRoute>} />

              {/* Pengeluaran */}
              <Route path="/expenses" element={<ProtectedRoute roles={['manager', 'cashier']} featureId="expenses"><Expenses /></ProtectedRoute>} />
              <Route path="/pengeluaran/input" element={<ProtectedRoute roles={['manager', 'cashier']} featureId="expenses"><InputPengeluaran /></ProtectedRoute>} />
              <Route path="/pengeluaran/daftar" element={<ProtectedRoute roles={['manager', 'cashier']} featureId="expenses"><DaftarPengeluaranPage /></ProtectedRoute>} />

              {/* Cashier - Kasir (primary) */}
              <Route path="/transactions" element={<ProtectedRoute roles={['cashier', 'superadmin']} featureId="kasir"><Transactions /></ProtectedRoute>} />

              {/* Cashier - Penjualan (dropdown) */}
              <Route path="/penjualan/pesanan" element={<ProtectedRoute roles={['cashier', 'superadmin']} featureId="penjualan"><PesananPenjualan /></ProtectedRoute>} />
              <Route path="/penjualan/daftar" element={<ProtectedRoute roles={['cashier', 'superadmin']} featureId="penjualan"><DaftarPenjualan /></ProtectedRoute>} />
              <Route path="/penjualan/retur" element={<ProtectedRoute roles={['cashier', 'superadmin']} featureId="penjualan"><ReturPenjualan /></ProtectedRoute>} />
              <Route path="/penjualan/tertolak" element={<ProtectedRoute roles={['cashier', 'superadmin']} featureId="penjualan"><PenjualanTertolak /></ProtectedRoute>} />
              <Route path="/penjualan/qris" element={<ProtectedRoute roles={['cashier', 'superadmin']} featureId="penjualan"><QRIS /></ProtectedRoute>} />

              {/* Manager only */}
              <Route path="/products" element={<ProtectedRoute roles={['manager', 'superadmin']} featureId="master-data"><Products /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute roles={['manager', 'superadmin']} featureId="master-data"><ProductDetail /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute roles={['manager', 'superadmin']} featureId="employees"><Employees /></ProtectedRoute>} />
              <Route path="/employees/jadwal" element={<ProtectedRoute roles={['manager', 'superadmin']} featureId="employees"><JadwalKerja /></ProtectedRoute>} />
              <Route path="/employees/absensi" element={<ProtectedRoute roles={['manager', 'superadmin']} featureId="absensi"><Absensi /></ProtectedRoute>} />
              <Route path="/employees/komisi" element={<ProtectedRoute roles={['manager', 'superadmin']} featureId="komisi"><Komisi /></ProtectedRoute>} />
              <Route path="/members" element={<ProtectedRoute roles={['manager', 'cashier', 'superadmin']} featureId="membership"><Members /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute roles={['manager']} featureId="ai-chat"><AIChat /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute roles={['manager']} featureId="laporan"><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute roles={['manager']} featureId="settings"><Settings /></ProtectedRoute>} />

              {/* Master Data */}
              <Route path="/master/kategori" element={<ProtectedRoute roles={['manager']} featureId="master-data"><MasterKategori /></ProtectedRoute>} />
              <Route path="/master/satuan" element={<ProtectedRoute roles={['manager']} featureId="master-data"><MasterSatuan /></ProtectedRoute>} />
              <Route path="/master/gudang" element={<ProtectedRoute roles={['manager']} featureId="master-data"><MasterGudang /></ProtectedRoute>} />

              {/* Persediaan */}
              <Route path="/persediaan/produk" element={<ProtectedRoute roles={['manager']} featureId="persediaan"><DaftarProduk /></ProtectedRoute>} />
              <Route path="/persediaan/defecta" element={<ProtectedRoute roles={['manager']} featureId="persediaan"><Defecta /></ProtectedRoute>} />
              <Route path="/persediaan/kadaluarsa" element={<ProtectedRoute roles={['manager']} featureId="persediaan"><StokKadaluarsa /></ProtectedRoute>} />
              <Route path="/persediaan/opname" element={<ProtectedRoute roles={['manager']} featureId="persediaan"><StokOpname /></ProtectedRoute>} />
              <Route path="/persediaan/penyesuaian" element={<ProtectedRoute roles={['manager']} featureId="persediaan"><PenyesuaianStok /></ProtectedRoute>} />

              {/* Analisis */}
              <Route path="/analisis/pareto" element={<ProtectedRoute roles={['manager']} featureId="analisis"><AnalisisPareto /></ProtectedRoute>} />
              <Route path="/analisis/pembelian" element={<ProtectedRoute roles={['manager']} featureId="analisis"><AnalisisPembelian /></ProtectedRoute>} />
              <Route path="/analisis/harga" element={<ProtectedRoute roles={['manager']} featureId="analisis"><AnalisisHarga /></ProtectedRoute>} />

              {/* Laporan */}
              <Route path="/laporan/penjualan" element={<ProtectedRoute roles={['manager']} featureId="laporan"><LaporanPenjualan /></ProtectedRoute>} />
              <Route path="/laporan/pembelian" element={<ProtectedRoute roles={['manager']} featureId="laporan"><LaporanPembelian /></ProtectedRoute>} />
              <Route path="/laporan/persediaan" element={<ProtectedRoute roles={['manager']} featureId="laporan"><LaporanPersediaan /></ProtectedRoute>} />
              <Route path="/laporan/keuangan" element={<ProtectedRoute roles={['manager']} featureId="laporan"><LaporanKeuangan /></ProtectedRoute>} />

              {/* Multi Outlet */}
              <Route path="/outlet/mutasi-request" element={<ProtectedRoute roles={['manager']} featureId="multi-outlet"><PermintaanMutasi /></ProtectedRoute>} />
              <Route path="/outlet/mutasi" element={<ProtectedRoute roles={['manager']} featureId="multi-outlet"><MutasiAntarOutlet /></ProtectedRoute>} />
              <Route path="/outlet/produk-mitra" element={<ProtectedRoute roles={['manager']} featureId="multi-outlet"><ProdukMitra /></ProtectedRoute>} />
              <Route path="/outlet/outlet-mitra" element={<ProtectedRoute roles={['manager']} featureId="multi-outlet"><OutletMitra /></ProtectedRoute>} />


              {/* Manajemen Pengguna */}
              <Route path="/users" element={<ProtectedRoute roles={['manager']}><DaftarPengguna /></ProtectedRoute>} />
              <Route path="/users/roles" element={<ProtectedRoute roles={['manager']}><PeranHakAkses /></ProtectedRoute>} />
              <Route path="/users/log" element={<ProtectedRoute roles={['manager']}><LogAktivitas /></ProtectedRoute>} />

              {/* Pengaturan */}
              <Route path="/settings/config" element={<ProtectedRoute roles={['manager']}><Konfigurasi /></ProtectedRoute>} />

              {/* Pusat Bantuan */}
              <Route path="/help/request" element={<ProtectedRoute roles={['manager']}><MintaBantuan /></ProtectedRoute>} />
              <Route path="/help/updates" element={<ProtectedRoute roles={['manager']}><RiwayatUpdate /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </AntdConfigWrapper>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
