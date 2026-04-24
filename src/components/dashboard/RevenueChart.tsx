import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { dailyData } from '@/data/mockData';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const RevenueChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const chartRef = useRef<any>(null);

  // Re-size chart when window resizes or sidebar toggles
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    // Small delay to account for sidebar animation
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
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
      formatter: (params: any) => {
        let res = `<div style="padding: 4px; min-width: 120px;"><div style="font-weight: bold; margin-bottom: 6px; font-size: 12px;">${params[0].name}</div>`;
        params.forEach((item: any) => {
          res += `<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${item.color};"></div>
              <span style="color: ${isDark ? '#9ca3af' : '#6b7280'}; font-size: 11px;">${item.seriesName}</span>
            </div>
            <span style="font-weight: bold; font-size: 11px;">${formatCurrency(item.value)}</span>
          </div>`;
        });
        res += '</div>';
        return res;
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
      boundaryGap: false,
      data: dailyData.map(d => d.day),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
        fontSize: isMobile ? 10 : 12,
        margin: isMobile ? 10 : 15,
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
        name: 'Revenue',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: dailyData.map(d => d.revenue),
        lineStyle: {
          width: isMobile ? 2 : 3,
          color: '#3b82f6',
        },
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' },
            ],
          },
        },
      },
      {
        name: 'HPP',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: dailyData.map(d => d.hpp),
        lineStyle: {
          width: isMobile ? 1.5 : 2,
          color: '#ef4444',
        },
        itemStyle: {
          color: '#ef4444',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 68, 68, 0.15)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0)' },
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
      transition={{ duration: 0.4, delay: 0.3 }}
      className="col-span-1 xl:col-span-2 p-4 md:p-6 rounded-2xl bg-card/40 border border-border/30"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold">Revenue vs HPP</h3>
          <p className="text-sm text-muted-foreground">Trend 7 hari terakhir</p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground text-xs font-medium">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground text-xs font-medium">HPP</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72">
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
