import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Calendar, 
  Wallet, 
  Save,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { businessData as initialBusinessData, BusinessData } from '@/data/mockData';
import { toast } from 'sonner';
import { Select } from 'antd';

const Settings = () => {
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);
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
    toast.success('Data bisnis berhasil disimpan!');
    setIsSaved(true);
  };

  const businessTypes = [
    'Kuliner',
    'Retail',
    'Jasa',
    'Manufaktur',
    'Lainnya',
  ];

  const capitalSources = [
    'Investasi Pribadi',
    'Pinjaman Bank',
    'Modal Partner',
    'Investor',
    'Lainnya',
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-1">Pengaturan Bisnis</h1>
          <p className="text-muted-foreground">
            Kelola informasi dasar bisnis dan modal awal Anda
          </p>
        </motion.div>

        {/* Business Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Data Umum Bisnis</h2>
              <p className="text-sm text-muted-foreground">Informasi dasar tentang usaha Anda</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Nama Bisnis
                </label>
                <Input
                  value={businessData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama bisnis"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Jenis Usaha
                </label>
                <Select
                  value={businessData.type}
                  onChange={(value) => handleInputChange('type', value)}
                  className="w-full h-10"
                  dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                  suffixIcon={<ChevronDown className="w-3 h-3" />}
                  options={businessTypes.map(t => ({ value: t, label: t }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Alamat Usaha
              </label>
              <Input
                value={businessData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor Telepon
                </label>
                <Input
                  value={businessData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Contoh: 021-1234567"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Berdiri
                </label>
                <Input
                  type="date"
                  value={businessData.foundingDate}
                  onChange={(e) => handleInputChange('foundingDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Capital Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Modal Awal</h2>
              <p className="text-sm text-muted-foreground">Informasi modal untuk memulai usaha</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Jumlah Modal Awal (IDR)
              </label>
              <Input
                type="number"
                value={businessData.initialCapital}
                onChange={(e) => handleInputChange('initialCapital', parseInt(e.target.value) || 0)}
                placeholder="Masukkan jumlah modal"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(businessData.initialCapital)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Sumber Modal
              </label>
              <Select
                value={businessData.capitalSource}
                onChange={(value) => handleInputChange('capitalSource', value)}
                className="w-full h-10"
                dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                suffixIcon={<ChevronDown className="w-3 h-3" />}
                options={capitalSources.map(s => ({ value: s, label: s }))}
              />
            </div>
          </div>

          {/* Capital Summary */}
          <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
            <h3 className="font-medium mb-3">Ringkasan Modal</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Modal Awal</p>
                <p className="font-semibold number-display text-lg">{formatCurrency(businessData.initialCapital)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sumber</p>
                <p className="font-semibold">{businessData.capitalSource}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <Button onClick={handleSave} className="gap-2">
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Tersimpan
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Data Bisnis
              </>
            )}
          </Button>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 border-l-4 border-l-warning"
        >
          <p className="text-sm text-muted-foreground">
            <strong>Catatan:</strong> Data bisnis ini akan digunakan untuk identifikasi dan laporan. 
            Pastikan informasi yang dimasukkan sudah benar.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;
