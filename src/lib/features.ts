
export interface Feature {
  id: string;
  label: string;
  isMandatory: boolean;
  description: string;
}

export const APP_FEATURES: Feature[] = [
  // Mandatory Features (Paket Basic)
  { id: 'kasir', label: 'Kasir', isMandatory: true, description: 'Sistem point of sale utama' },
  { id: 'penjualan', label: 'Penjualan', isMandatory: true, description: 'Manajemen transaksi penjualan' },
  { id: 'master-data', label: 'Master Data', isMandatory: true, description: 'Pengelolaan produk, kategori, dan satuan' },
  { id: 'persediaan', label: 'Persediaan', isMandatory: true, description: 'Manajemen stok dan opname' },
  { id: 'laporan', label: 'Laporan', isMandatory: true, description: 'Laporan bisnis dasar' },
  { id: 'settings', label: 'Pengaturan', isMandatory: true, description: 'Konfigurasi profil bisnis' },
  { id: 'user-management', label: 'Manajemen Pengguna', isMandatory: true, description: 'Pengaturan hak akses karyawan' },
  { id: 'help', label: 'Pusat Bantuan', isMandatory: true, description: 'Bantuan dan update sistem' },

  // Custom Features (Optional)
  { id: 'expenses', label: 'Pengeluaran', isMandatory: false, description: 'Pencatatan biaya operasional' },
  { id: 'employees', label: 'Karyawan', isMandatory: false, description: 'Manajemen data karyawan' },
  { id: 'absensi', label: 'Absensi Fingerprint', isMandatory: false, description: 'Sistem absensi terintegrasi fingerprint' },
  { id: 'komisi', label: 'Komisi Penjualan', isMandatory: false, description: 'Pelacakan komisi penjualan karyawan' },
  { id: 'analisis', label: 'Analisis', isMandatory: false, description: 'Analisis Pareto, harga, dan pembelian' },
  { id: 'multi-outlet', label: 'Multi Outlet', isMandatory: false, description: 'Manajemen stok antar cabang' },
  { id: 'ai-chat', label: 'Chat AI', isMandatory: false, description: 'Asisten AI untuk analisis data' },
  { id: 'online-delivery', label: 'Online Delivery', isMandatory: false, description: 'Integrasi pesanan dari ojek online (GoFood, GrabFood, dll)' },
  { id: 'membership', label: 'Manajemen Member', isMandatory: false, description: 'Program loyalitas, poin, dan diskon khusus member' },
];
