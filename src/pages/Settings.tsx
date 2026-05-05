import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Save,
  CheckCircle,
  ChevronDown,
  ReceiptText,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { businessData as initialBusinessData, BusinessData } from '@/data/mockData';
import { toast } from 'sonner';
import { Select } from 'antd';

const Settings = () => {
  // Load from localStorage or use initial mock data
  const [businessData, setBusinessData] = useState<BusinessData>(() => {
    const saved = localStorage.getItem('teratur_business_data');
    return saved ? JSON.parse(saved) : initialBusinessData;
  });
  
  const [isSaved, setIsSaved] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleInputChange = (field: keyof BusinessData, value: string | number) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('teratur_business_data', JSON.stringify(businessData));
    toast.success('Pengaturan Struk & Bisnis berhasil disimpan!', {
      description: 'Printer akan menggunakan data terbaru ini.'
    });
    setIsSaved(true);
  };

  const businessTypes = ['Kuliner', 'Retail', 'Jasa', 'Manufaktur', 'Lainnya'];
  const capitalSources = ['Investasi Pribadi', 'Pinjaman Bank', 'Modal Partner', 'Investor', 'Lainnya'];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-1">Pengaturan Kasir & Struk</h1>
          <p className="text-muted-foreground">
            Kelola identitas toko dan sesuaikan tampilan nota thermal MP-58n Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: FORMS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Business Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Profil Toko</h2>
                  <p className="text-sm text-muted-foreground">Muncul di paling atas struk belanja</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Nama Toko</label>
                  <Input
                    value={businessData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Masukkan nama toko"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Alamat Lengkap</label>
                  <Input
                    value={businessData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Contoh: Jl. Sudirman No. 123"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">WhatsApp / Telp</label>
                    <Input
                      value={businessData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Jenis Usaha</label>
                    <Select
                      value={businessData.type}
                      onChange={(value) => handleInputChange('type', value)}
                      className="w-full h-10"
                      options={businessTypes.map(t => ({ value: t, label: t }))}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Receipt Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <ReceiptText className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Kustomisasi Pesan Struk</h2>
                  <p className="text-sm text-muted-foreground">Pesan tambahan untuk pelanggan Anda</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Header Tambahan (Dibawah Nama Toko)</label>
                  <Input
                    value={businessData.receiptHeader}
                    onChange={(e) => handleInputChange('receiptHeader', e.target.value)}
                    placeholder="Contoh: Promo: Beli 2 Gratis 1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Pesan Footer (Paling Bawah)</label>
                  <Input
                    value={businessData.receiptFooter}
                    onChange={(e) => handleInputChange('receiptFooter', e.target.value)}
                    placeholder="Contoh: Barang tidak dapat ditukar"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Lebar Kertas Printer</label>
                  <Select
                    value={businessData.paperSize}
                    onChange={(value) => handleInputChange('paperSize', value)}
                    className="w-full h-10"
                    options={[
                      { value: '58mm', label: '58mm (Handheld/MP-58n)' },
                      { value: '80mm', label: '80mm (Desktop/Besar)' },
                    ]}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: PREVIEW */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Preview ({businessData.paperSize})
                </h3>
              </div>
              
              {/* Thermal Paper Simulation */}
              <div className="bg-white text-black p-6 shadow-2xl border-t-8 border-t-zinc-200 mx-auto max-w-[280px] font-mono text-[10px] leading-tight text-zinc-800">
                <div className="text-center space-y-1">
                  <h4 className="font-bold text-xs uppercase">{businessData.name || 'NAMA TOKO'}</h4>
                  <p className="whitespace-pre-wrap">{businessData.address || 'Alamat Toko'}</p>
                  <p>{businessData.phone || '08XX-XXXX-XXXX'}</p>
                </div>
                
                <div className="border-b border-dashed border-zinc-300 my-2" />
                {businessData.receiptHeader && (
                  <>
                    <div className="text-center italic">{businessData.receiptHeader}</div>
                    <div className="border-b border-dashed border-zinc-300 my-2" />
                  </>
                )}
                
                <div className="flex justify-between opacity-70">
                  <span>TRX-998877</span>
                  <span>05/05/2026</span>
                </div>
                <div className="mb-2 opacity-70">Kasir: Barista</div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Espresso x2</span>
                    <span>40.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Caramel Latte x1</span>
                    <span>35.000</span>
                  </div>
                </div>
                
                <div className="border-b border-dashed border-zinc-300 my-2" />
                <div className="flex justify-between font-bold text-xs">
                  <span>TOTAL</span>
                  <span>75.000</span>
                </div>
                <div className="flex justify-between">
                  <span>BAYAR</span>
                  <span>100.000</span>
                </div>
                <div className="flex justify-between">
                  <span>KEMBALI</span>
                  <span>25.000</span>
                </div>
                
                <div className="border-b border-dashed border-zinc-300 my-2" />
                <div className="text-center space-y-1 pt-2">
                  <p className="whitespace-pre-wrap">{businessData.receiptFooter}</p>
                  <p className="font-bold text-[8px] opacity-50 mt-2">Powered by Teratur.id</p>
                </div>
              </div>

              <Button 
                onClick={handleSave} 
                className={`w-full mt-6 gap-2 h-12 shadow-lg transition-all ${isSaved ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Tersimpan
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
