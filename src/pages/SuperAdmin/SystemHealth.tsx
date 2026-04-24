import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Server, Database, Globe, Zap, 
  Cpu, Activity, ShieldCheck, AlertCircle,
  RefreshCcw, Terminal, Search
} from 'lucide-react';
import { toast } from 'sonner';

const SystemHealth = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Mengecek status infrastruktur...',
        success: 'Sistem dalam kondisi optimal!',
        error: 'Gagal menghubungi server.',
        finally: () => setIsRefreshing(false)
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
            <p className="text-muted-foreground">Real-time infrastructure monitoring and system status.</p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl gap-2 h-11 px-6 bg-card/40"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'API Server', status: 'Operational', icon: Server, color: 'text-success' },
            { label: 'Database', status: 'Healthy', icon: Database, color: 'text-success' },
            { label: 'CDN Storage', status: 'Operational', icon: Globe, color: 'text-success' },
            { label: 'Security', status: 'Secure', icon: ShieldCheck, color: 'text-primary' },
          ].map((s, i) => (
            <Card key={i} className="border-border/30 bg-card/50 backdrop-blur-sm rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl bg-secondary/50 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm font-bold">{s.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resource Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Resource Utilization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>CPU Usage</span>
                  <span className={isRefreshing ? 'animate-pulse' : ''}>24%</span>
                </div>
                <Progress value={24} className="h-1.5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>RAM Usage</span>
                  <span className={isRefreshing ? 'animate-pulse' : ''}>42%</span>
                </div>
                <Progress value={42} className="h-1.5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Storage Capacity</span>
                  <span className={isRefreshing ? 'animate-pulse' : ''}>18%</span>
                </div>
                <Progress value={18} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/30 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">System Logs</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px]">REAL-TIME</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-[#0f172a] p-6 font-mono text-[11px] h-[180px] overflow-y-auto custom-scrollbar">
                <p className="text-blue-400">[info] API Gateway initialized on port 8080</p>
                <p className="text-green-400">[success] Database migration successful</p>
                <p className="text-slate-400">[log] Client "Kopi Teratur" authenticated</p>
                <p className="text-yellow-400">[warn] High memory usage detected in worker #4</p>
                <p className="text-slate-400">[log] Background task: Subscription renewal checker started</p>
                <p className="text-red-400">[error] Failed to fetch currency rates from provider</p>
                {isRefreshing && <p className="text-blue-300 animate-pulse">[info] System health scan in progress...</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card className="border-border/30 bg-card/50 backdrop-blur-sm rounded-3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" /> Recent System Events
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Search events..." className="h-8 pl-9 text-xs rounded-lg" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2 mins ago', event: 'New client registration: Bake & Brew', status: 'info' },
                { time: '15 mins ago', event: 'Weekly database optimization completed', status: 'success' },
                { time: '1 hour ago', event: 'Subscription plan upgrade: Kopi Teratur Pusat', status: 'info' },
                { time: '4 hours ago', event: 'Unusual login attempt from IP 182.xx.xx.xx', status: 'warning' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-4 text-sm py-2.5 border-b border-border/10 last:border-0 hover:bg-secondary/10 px-2 rounded-lg transition-colors cursor-pointer group">
                  <span className="text-xs text-muted-foreground w-20 whitespace-nowrap">{e.time}</span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${e.status === 'warning' ? 'bg-warning' : e.status === 'success' ? 'bg-success' : 'bg-primary'}`} />
                    <span className="font-medium">{e.event}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">View Log</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemHealth;
