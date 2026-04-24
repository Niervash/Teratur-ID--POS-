import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { costComposition } from '@/data/mockData';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b']; // primary, accent, warning

export const CostCompositionChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 300);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: {
        color: isDark ? '#f3f4f6' : '#1f2937',
      },
      formatter: (params: any) => {
        return `<div style="padding: 4px; font-size: 12px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${params.color};"></div>
            <span>${params.value}%</span>
          </div>
        </div>`;
      },
    },
    series: [
      {
        name: 'Komposisi Biaya',
        type: 'pie',
        radius: isMobile ? ['50%', '75%'] : ['55%', '85%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: isDark ? '#111827' : '#ffffff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        labelLine: {
          show: false,
        },
        data: costComposition.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: COLORS[index % COLORS.length] }
        })),
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="p-4 md:p-6 rounded-2xl bg-card/40 border border-border/30"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold">Komposisi Biaya</h3>
        <p className="text-sm text-muted-foreground">Breakdown per kategori</p>
      </div>

      <div className="h-44 sm:h-52">
        <ReactECharts 
          ref={chartRef}
          option={option} 
          style={{ height: '100%', width: '100%' }}
          settings={{ notMerge: true }}
        />
      </div>

      <div className="space-y-4 mt-6">
        {costComposition.map((item, index) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-bold text-muted-foreground uppercase tracking-tight">{item.name}</span>
              </div>
              <span className="font-black text-foreground">{item.value}%</span>
            </div>
            <div className="relative h-2 w-full bg-secondary/30 rounded-full overflow-hidden border border-border/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
