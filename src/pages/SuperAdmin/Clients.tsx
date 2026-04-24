import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { APP_FEATURES } from '@/lib/features';
import { 
  Building2, Search, MapPin, User,
  Plus, ExternalLink, X, Globe, Calendar, CheckCircle2,
  Settings2, ShieldCheck, Edit3, ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Select } from 'antd';

const INITIAL_CLIENTS = [
  { 
    id: '1', 
    name: 'Kopi Teratur', 
    type: 'Coffee Shop', 
    locations: 3, 
    owner: 'Budi Santoso', 
    status: 'active', 
    joined: '2024-01-10', 
    email: 'budi@kopiteratur.id', 
    phone: '08123456789',
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help'] // Paket Basic
  },
  { 
    id: '2', 
    name: 'Bake & Brew', 
    type: 'Bakery', 
    locations: 1, 
    owner: 'Siti Aminah', 
    status: 'active', 
    joined: '2024-03-15', 
    email: 'siti@bakebrew.id', 
    phone: '08129876543',
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help', 'expenses', 'ai-chat'] // Custom
  },
  { 
    id: '3', 
    name: 'Warung Modern', 
    type: 'Resto', 
    locations: 5, 
    owner: 'Andi Wijaya', 
    status: 'active', 
    joined: '2023-11-20', 
    email: 'andi@warmod.id', 
    phone: '08112233445',
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help', 'expenses', 'employees', 'analisis', 'multi-outlet', 'ai-chat'] // Full
  },
  { 
    id: '4', 
    name: 'Sate Khas Solo', 
    type: 'Resto', 
    locations: 2, 
    owner: 'Joko Widodo', 
    status: 'suspended', 
    joined: '2024-02-05', 
    email: 'joko@satesolo.id', 
    phone: '08556677889',
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help']
  },
];

const Clients = () => {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [clientFeatures, setClientFeatures] = useState<string[]>([]);

  // Form states for edit
  const [editForm, setEditForm] = useState({
    name: '',
    owner: '',
    type: '',
    email: '',
    phone: '',
    status: ''
  });

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (client: any) => {
    setSelectedClient(client);
    setEditForm({
      name: client.name,
      owner: client.owner,
      type: client.type,
      email: client.email,
      phone: client.phone,
      status: client.status
    });
    setIsEditOpen(true);
    setIsDetailOpen(false); // Close detail if open
  };

  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    setClients(prev => prev.map(c => 
      c.id === selectedClient.id ? { ...c, ...editForm } : c
    ));
    toast.success(`Data ${editForm.name} berhasil diperbarui!`);
    setIsEditOpen(false);
  };

  const handleManageFeatures = (client: any) => {
    setSelectedClient(client);
    setClientFeatures(client.enabledFeatures || []);
    setIsFeaturesOpen(true);
  };

  const toggleFeature = (featureId: string) => {
    setClientFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const saveFeatures = () => {
    setClients(prev => prev.map(c => 
      c.id === selectedClient.id ? { ...c, enabledFeatures: clientFeatures } : c
    ));
    toast.success(`Fitur untuk ${selectedClient.name} berhasil diperbarui!`);
    setIsFeaturesOpen(false);
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified add logic for demo
    toast.success("Client baru berhasil didaftarkan ke sistem!");
    setIsAddOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
            <p className="text-muted-foreground">Manage business profiles and access for Teratur clients.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Add New Client
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients by name, owner, or type..." 
            className="pl-9 h-11 bg-card/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
            <Card key={client.id} className="border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Building2 className="w-6 h-6" />
                </div>
                <Badge variant={client.status === 'active' ? 'success' : 'destructive'} className="text-[10px]">
                  {client.status.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{client.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{client.type}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1.5"><User className="w-3 h-3" /> Owner</p>
                    <p className="font-semibold">{client.owner}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-muted-foreground flex items-center justify-end gap-1.5"><MapPin className="w-3 h-3" /> Outlets</p>
                    <p className="font-semibold">{client.locations} Locations</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/30 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 text-xs"
                    onClick={() => handleManageFeatures(client)}
                  >
                    <Settings2 className="w-3 h-3" /> Features
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 text-xs"
                    onClick={() => handleOpenEdit(client)}
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-2 text-xs col-span-2"
                    onClick={() => handleViewDetails(client)}
                  >
                    View Details <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Management Dialog */}
      <Dialog open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-6 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">Feature Access Management</DialogTitle>
                <DialogDescription>
                  Enable or disable features for <span className="font-bold text-foreground">{selectedClient?.name}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] px-1 h-4">BASIC</Badge> Mandatory Features (Always On)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {APP_FEATURES.filter(f => f.isMandatory).map(feature => (
                  <div key={feature.id} className="flex items-start space-x-3 p-3 rounded-xl bg-secondary/20 border border-border/10 opacity-70">
                    <Checkbox checked={true} disabled className="mt-1" />
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold leading-none">{feature.label}</label>
                      <p className="text-[11px] text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                <Badge className="text-[9px] px-1 h-4">CUSTOM</Badge> Optional Add-ons
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {APP_FEATURES.filter(f => !f.isMandatory).map(feature => (
                  <div 
                    key={feature.id} 
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      clientFeatures.includes(feature.id) 
                        ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' 
                        : 'bg-card border-border/30 hover:border-primary/20'
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <Checkbox 
                      checked={clientFeatures.includes(feature.id)} 
                      onCheckedChange={() => toggleFeature(feature.id)}
                      className="mt-1"
                    />
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold leading-none cursor-pointer">{feature.label}</label>
                      <p className="text-[11px] text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border/30 mt-6">
            <Button className="flex-1 rounded-xl shadow-lg shadow-primary/20" onClick={saveFeatures}>
              Save Configuration
            </Button>
            <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setIsFeaturesOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedClient && (
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />
              <div className="px-8 pb-8 -mt-12">
                <div className="w-24 h-24 rounded-3xl bg-card border-4 border-background flex items-center justify-center text-primary shadow-xl mb-4">
                  <Building2 className="w-10 h-10" />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest">{selectedClient.type}</p>
                  </div>
                  <Badge variant={selectedClient.status === 'active' ? 'success' : 'destructive'}>
                    {selectedClient.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Owner Name</p>
                    <p className="font-bold flex items-center gap-2 text-sm"><User className="w-4 h-4 opacity-50" /> {selectedClient.owner}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Email Address</p>
                    <p className="font-bold flex items-center gap-2 text-sm"><Globe className="w-4 h-4 opacity-50" /> {selectedClient.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Phone Number</p>
                    <p className="font-bold flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> {selectedClient.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Member Since</p>
                    <p className="font-bold flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 opacity-50" /> {new Date(selectedClient.joined).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 rounded-xl" onClick={() => handleOpenEdit(selectedClient)}>Edit Profile</Button>
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDetailOpen(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Business Profile</DialogTitle>
            <DialogDescription>Perbarui informasi profil untuk <span className="font-bold">{selectedClient?.name}</span>.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClient} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Name</label>
                <Input 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Owner Name</label>
                <Input 
                  value={editForm.owner} 
                  onChange={(e) => setEditForm({...editForm, owner: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Type</label>
                <Select 
                  className="w-full h-10"
                  dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                  value={editForm.type}
                  onChange={(value) => setEditForm({...editForm, type: value})}
                  suffixIcon={<ChevronDown className="w-3 h-3" />}
                  options={[
                    { value: 'Coffee Shop', label: 'Coffee Shop' },
                    { value: 'Resto', label: 'Resto' },
                    { value: 'Bakery', label: 'Bakery' },
                  ]}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                <Input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</label>
                <Select 
                  className="w-full h-10"
                  dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                  value={editForm.status}
                  onChange={(value) => setEditForm({...editForm, status: value})}
                  suffixIcon={<ChevronDown className="w-3 h-3" />}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'suspended', label: 'Suspended' },
                  ]}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 rounded-xl">Save Changes</Button>
              <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Client</DialogTitle>
            <DialogDescription>Daftarkan bisnis F&B baru ke ekosistem Teratur.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Name</label>
                <Input placeholder="Contoh: Kopi Teratur Pusat" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Owner Name</label>
                <Input placeholder="Nama Lengkap" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Type</label>
                <Select 
                  className="w-full h-10"
                  placeholder="Pilih tipe"
                  dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                  suffixIcon={<ChevronDown className="w-3 h-3" />}
                  options={[
                    { value: 'Coffee Shop', label: 'Coffee Shop' },
                    { value: 'Resto', label: 'Resto' },
                    { value: 'Bakery', label: 'Bakery' },
                  ]}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                <Input type="email" placeholder="email@bisnis.id" required />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 rounded-xl">Register Business</Button>
              <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Clients;
