# TERATUR.ID - Flowchart Dokumentasi

Kumpulan flowchart yang mendokumentasikan seluruh alur logika aplikasi, dipisahkan per fase operasional dan per fitur.

## Workflow Keseluruhan

Aplikasi ini mendukung alur operasional vendor MBG (Makan Bergizi) dari pembelian bahan baku hingga pelaporan harian, dengan integrasi **Smart Scanner** untuk quality control dan **Smart Vision** untuk monitoring kepatuhan produksi.

### 5 Fase Utama

| Fase | Deskripsi |
|------|-----------|
| 1. Pembelian Bahan Baku | Vendor input data belanjaan dan menu produksi, sistem otomatis hitung gizi, modal, dan prediksi porsi |
| 2. Pengecekan Bahan Baku | Bahan dari supplier di-scan Smart Scanner untuk QC otomatis, cross check manual untuk yang tidak layak |
| 3. Produksi Menu | Karyawan scan APD via Smart Vision, bahan di-scan ulang, produksi diawasi kepatuhan APD & SOP |
| 4. Pencatatan Total Porsi | Catat porsi aktual, bandingkan dengan prediksi, catat penerima manfaat |
| 5. Laporan | Dashboard ringkasan harian + dokumen PDF otomatis mencakup semua data dari fase 1-4 |

## Daftar Flowchart

| No | File | Deskripsi |
|----|------|-----------|
| 00 | `00_full_application_workflow.mmd` | **Workflow keseluruhan aplikasi** - semua fase dalam satu diagram |
| 01 | `01_overview_system.mmd` | Overview navigasi sistem per role |
| 02 | `02_auth_flow.mmd` | Alur autentikasi (Login, Register, Demo) |
| 03 | `03_manager_produk.mmd` | Manager: CRUD Produk, Resep, HPP, BTKL |
| 04 | `04_manager_karyawan.mmd` | Manager: Manajemen Karyawan |
| 05 | `05_cashier_transaksi.mmd` | Cashier: POS / Transaksi Penjualan |
| 06 | `06_pengeluaran.mmd` | Pengeluaran (berbeda per role) |
| 07 | `07_manager_laporan.mmd` | Manager: Laporan & Export |
| 08 | `08_manager_ai_chat.mmd` | Manager: Chat AI |
| 09 | `09_dashboard.mmd` | Dashboard (berbeda per role) |
| 10 | `10_shift_management.mmd` | Alur Manajemen Shift & Kas (POS) |

## Teknologi Terintegrasi

| Komponen | Fungsi |
|----------|--------|
| **Smart Scanner** | QC otomatis bahan baku (klasifikasi layak/tidak layak) |
| **Smart Vision** | Deteksi kepatuhan APD & monitoring SOP produksi |
| **Sistem Kalkulasi** | Otomatis hitung kandungan gizi, modal per porsi, prediksi total porsi |
| **Dashboard** | Ringkasan harian seluruh operasional |
| **PDF Generator** | Dokumen laporan harian otomatis |

## Cara Melihat

File `.mmd` menggunakan format [Mermaid](https://mermaid.js.org/). Bisa dilihat di:
- **GitHub** - otomatis render diagram Mermaid
- **VS Code** - install extension "Mermaid Preview"
- **Online** - paste ke [mermaid.live](https://mermaid.live)
