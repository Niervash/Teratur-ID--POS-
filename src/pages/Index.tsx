import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { CostCompositionChart } from '@/components/dashboard/CostCompositionChart';
import { TopProducts } from '@/components/dashboard/TopProducts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProfitChart } from '@/components/dashboard/ProfitChart';
import { kpiData } from '@/data/mockData';
import { 
  Wallet, TrendingUp, Receipt, DollarSign, 
  Download, Calendar as CalendarIcon, Filter, ChevronDown,
  FileSpreadsheet, FileText, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from 'antd';
import { toast } from 'sonner';
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const Index = () => {
  const [dateRange, setDateRange] = useState('month');
  const [customDate, setCustomDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [dataScope, setDataScope] = useState('partial');
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExport = (type: string) => {
    setIsExporting(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Menyiapkan data ${type}...`,
        success: `Laporan ${type} berhasil diunduh!`,
        error: 'Gagal mengunduh laporan.',
      }
    ).finally(() => setIsExporting(false));
  };

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    setCustomDate(range);
    if (range?.from && range?.to) {
      setDateRange('custom');
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs md:text-sm text-muted-foreground mb-1"
            >
              Selamat datang kembali 👋
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-extrabold tracking-tight"
            >
              Dashboard Analitik
            </motion.h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Date */}
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md border border-border/30 p-1 rounded-xl">
              <Button 
                variant={dateRange === 'today' ? 'primary' : 'ghost'} 
                size="sm" 
                className="h-8 rounded-lg text-xs"
                onClick={() => setDateRange('today')}
              >
                Hari Ini
              </Button>
              <Button 
                variant={dateRange === 'month' ? 'primary' : 'ghost'} 
                size="sm" 
                className="h-8 rounded-lg text-xs"
                onClick={() => setDateRange('month')}
              >
                Bulan Ini
              </Button>
              <Button 
                variant={dateRange === 'year' ? 'primary' : 'ghost'} 
                size="sm" 
                className="h-8 rounded-lg text-xs"
                onClick={() => setDateRange('year')}
              >
                Tahun Ini
              </Button>
              <div className="w-[1px] h-4 bg-border/50 mx-1" />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant={dateRange === 'custom' ? 'primary' : 'ghost'} 
                    size="sm" 
                    className="h-8 rounded-lg text-xs gap-2"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" /> 
                    {dateRange === 'custom' && customDate?.from ? (
                      customDate.to ? (
                        `${format(customDate.from, "dd LLL")} - ${format(customDate.to, "dd LLL")}`
                      ) : (
                        format(customDate.from, "dd LLL")
                      )
                    ) : (
                      "Kustom"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-border/30 shadow-2xl" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={customDate?.from}
                    selected={customDate}
                    onSelect={handleCustomDateSelect}
                    numberOfMonths={2}
                    className="rounded-2xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data Scope with Ant Design Select */}
            <Select 
              value={dataScope} 
              onChange={setDataScope}
              className="w-[160px]"
              dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
              suffixIcon={<ChevronDown className="w-3 h-3" />}
              options={[
                { value: 'partial', label: 'Data Parsial' },
                { value: 'all', label: 'Seluruh Data' },
                { value: 'outlet', label: 'Outlet Ini Saja' },
              ]}
            />

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20">
                  <Download className="w-4 h-4" /> Unduh Laporan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                <DropdownMenuLabel>Format Laporan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('Excel')} className="gap-2 cursor-pointer p-3">
                  <FileSpreadsheet className="w-4 h-4 text-success" /> Export ke Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('PDF')} className="gap-2 cursor-pointer p-3">
                  <FileText className="w-4 h-4 text-destructive" /> Export ke PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('CSV')} className="gap-2 cursor-pointer p-3">
                  <BarChart2 className="w-4 h-4 text-primary" /> Export ke CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status Bar */}
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 text-[11px] font-bold uppercase tracking-wider text-primary/70"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live Data
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            Periode: {dateRange === 'today' ? '21 April 2024' : dateRange === 'month' ? 'April 2024' : 'Tahun 2024'}
            <div className="w-1 h-1 rounded-full bg-border" />
            Mode: {dataScope === 'all' ? 'FULL ARCHIVE' : 'REAL-TIME ANALYTICS'}
          </motion.div>
        </AnimatePresence>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(kpiData.totalRevenue)}
            subtitle="Bulan ini"
            icon={Wallet}
            trend={{ value: 12.5, isPositive: true }}
            variant="default"
            delay={0}
          />
          <KPICard
            title="Total HPP"
            value={formatCurrency(kpiData.totalHpp)}
            subtitle="Bulan ini"
            icon={DollarSign}
            trend={{ value: 8.2, isPositive: false }}
            variant="destructive"
            delay={0.1}
          />
          <KPICard
            title="Gross Margin"
            value={`${kpiData.grossMargin}%`}
            subtitle="Target: 65%"
            icon={TrendingUp}
            trend={{ value: 3.1, isPositive: true }}
            variant="success"
            delay={0.2}
          />
          <KPICard
            title="Total Transaksi"
            value={kpiData.totalTransactions.toLocaleString()}
            subtitle="Bulan ini"
            icon={Receipt}
            variant="default"
            delay={0.3}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <RevenueChart />
          <CostCompositionChart />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TopProducts />
          <ProfitChart />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </Layout>
  );
};

export default Index;
