import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { dailyData } from '@/data/mockData';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const ProfitChart = () => {
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

  const formatCurrency = (value: number) => `Rp ${(value / 1000000).toFixed(1)}M`;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: {
        color: isDark ? '#f3f4f6' : '#1f2937',
      },
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        return `<div style="padding: 4px; font-size: 12px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${params[0].name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6;"></div>
            <span style="color: #10b981; font-weight: bold;">Profit: ${formatCurrency(params[0].value)}</span>
          </div>
        </div>`;
      },
    },
    grid: {
      left: isMobile ? '2%' : '3%',
      right: isMobile ? '4%' : '4%',
      bottom: '3%',
      top: isMobile ? '5%' : '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dailyData.map(d => d.day),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
        fontSize: isMobile ? 10 : 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: isDark ? '#374151' : '#f3f4f6',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
        fontSize: isMobile ? 10 : 12,
        formatter: (value: number) => {
          if (isMobile) return `${(value / 1000000).toFixed(0)}M`;
          return `${(value / 1000000).toFixed(1)}M`;
        },
      },
    },
    series: [
      {
        name: 'Profit',
        type: 'bar',
        barWidth: isMobile ? '50%' : '40%',
        data: dailyData.map(d => d.profit),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.9)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.3)' },
            ],
          },
        },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="p-4 md:p-6 rounded-2xl bg-card/40 border border-border/30"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold">Profit Harian</h3>
        <p className="text-sm text-muted-foreground">7 hari terakhir</p>
      </div>

      <div className="h-56 sm:h-64">
        <ReactECharts 
          ref={chartRef}
          option={option} 
          style={{ height: '100%', width: '100%' }}
          settings={{ notMerge: true }}
        />
      </div>
    </motion.div>
  );
};
