import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Calendar, ArrowUpRight, Filter, Download, Settings2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const mockSubscriptions = [
  { id: '1', client: 'Kopi Teratur Pusat', plan: 'Pro', status: 'active', renewal: '2026-05-10', amount: 450000 },
  { id: '2', client: 'Bake & Brew', plan: 'Enterprise', status: 'active', renewal: '2026-12-15', amount: 1200000 },
  { id: '3', client: 'Warung Modern', plan: 'Basic', status: 'expiring', renewal: '2026-04-25', amount: 150000 },
  { id: '4', client: 'Sate Khas Solo', plan: 'Pro', status: 'inactive', renewal: '2026-01-10', amount: 450000 },
];

const Subscriptions = () => {
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const handleManage = (sub: any) => {
    setSelectedSub(sub);
    setIsManageOpen(true);
  };

  const handleExport = () => {
    toast.info("Menyiapkan laporan langganan...", { description: "Laporan akan diunduh secara otomatis." });
    setTimeout(() => toast.success("Laporan berhasil diunduh!"), 2000);
  };

  const handleUpdatePlan = () => {
    toast.success("Subscription plan berhasil diperbarui!");
    setIsManageOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
            <p className="text-muted-foreground">Monitor and manage client subscription plans and renewals.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button size="sm" className="gap-2 rounded-xl" onClick={handleExport}>
              <Download className="w-4 h-4" /> Export Report
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription>Monthly Recurring Revenue</CardDescription>
              <CardTitle className="text-2xl font-bold">Rp 42.500.000</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-success font-medium">
                <ArrowUpRight className="w-3 h-3" /> +12.5% from last month
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription>Active Subscriptions</CardDescription>
              <CardTitle className="text-2xl font-bold">128</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={85} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription>Expiring This Month</CardDescription>
              <CardTitle className="text-2xl font-bold text-warning">12</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Action required for renewal</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/20">
                  <TableHead className="min-w-[150px]">Client Name</TableHead>
                  <TableHead className="min-w-[100px]">Plan</TableHead>
                  <TableHead className="min-w-[150px]">Renewal Date</TableHead>
                  <TableHead className="min-w-[120px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-right min-w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubscriptions.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-secondary/10">
                    <TableCell className="font-medium">{sub.client}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 inline mr-2 opacity-50" />
                      {new Date(sub.renewal).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="font-medium text-sm whitespace-nowrap">
                      Rp {sub.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={sub.status === 'active' ? 'success' : sub.status === 'expiring' ? 'warning' : 'secondary'}
                        className="capitalize text-[10px]"
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleManage(sub)}>Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Ubah paket atau status langganan klien.
            </DialogDescription>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-6 pt-4">
              <div className="p-4 bg-secondary/50 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">Current Client</p>
                <p className="font-bold">{selectedSub.client}</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Select New Plan</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Basic', 'Pro', 'Enterprise'].map((p) => (
                    <button 
                      key={p}
                      onClick={handleUpdatePlan}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        selectedSub.plan === p ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="font-medium">{p} Plan</span>
                      {selectedSub.plan === p && <Settings2 className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Subscriptions;
