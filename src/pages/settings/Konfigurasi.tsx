import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Wrench, Save, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select } from 'antd';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Config {
  notifPenjualan: boolean;
  notifStokRendah: boolean;
  batasStokRendah: number;
  formatTanggal: string;
  autoBackup: boolean;
  bahasa: string;
  tema: string;
}

const Konfigurasi = () => {
  const [config, setConfig] = useLocalStorage<Config>('teratur_config', {
    notifPenjualan: true, notifStokRendah: true, batasStokRendah: 10,
    formatTanggal: 'DD/MM/YYYY', autoBackup: false, bahasa: 'id', tema: 'dark',
  });

  const handleSave = () => { toast.success('Konfigurasi disimpan'); };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-foreground">Konfigurasi</h1><p className="text-muted-foreground text-sm">Konfigurasi sistem, notifikasi, dan preferensi</p></div>
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Simpan</Button>
        </div>

        <div className="grid gap-6">
          <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Notifikasi</h3>
            <div className="flex items-center justify-between"><Label>Notifikasi Penjualan Baru</Label><Switch checked={config.notifPenjualan} onCheckedChange={v => setConfig({ ...config, notifPenjualan: v })} /></div>
            <div className="flex items-center justify-between"><Label>Notifikasi Stok Rendah</Label><Switch checked={config.notifStokRendah} onCheckedChange={v => setConfig({ ...config, notifStokRendah: v })} /></div>
            <div className="flex items-center gap-4"><Label>Batas Stok Rendah</Label><Input type="number" className="w-24" value={config.batasStokRendah} onChange={e => setConfig({ ...config, batasStokRendah: parseInt(e.target.value) || 0 })} /></div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Preferensi</h3>
            <div className="flex items-center gap-4">
              <Label className="w-40">Format Tanggal</Label>
              <Select 
                className="w-48"
                dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                suffixIcon={<ChevronDown className="w-3 h-3" />}
                value={config.formatTanggal} 
                onChange={v => setConfig({ ...config, formatTanggal: v })}
                options={[
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-40">Bahasa</Label>
              <Select 
                className="w-48"
                dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                suffixIcon={<ChevronDown className="w-3 h-3" />}
                value={config.bahasa} 
                onChange={v => setConfig({ ...config, bahasa: v })}
                options={[
                  { value: 'id', label: 'Bahasa Indonesia' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-40">Tema</Label>
              <Select 
                className="w-48"
                dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                suffixIcon={<ChevronDown className="w-3 h-3" />}
                value={config.tema} 
                onChange={v => setConfig({ ...config, tema: v })}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'auto', label: 'Auto' },
                ]}
              />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Sistem</h3>
            <div className="flex items-center justify-between"><Label>Auto Backup Harian</Label><Switch checked={config.autoBackup} onCheckedChange={v => setConfig({ ...config, autoBackup: v })} /></div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Konfigurasi;
