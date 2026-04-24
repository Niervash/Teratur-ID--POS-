import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Bot, Sparkles, Send, ShoppingCart, TrendingDown, BarChart3, Package, DollarSign, Calculator, Users, FileText, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { products, rawMaterials, dailyData, kpiData } from '@/data/mockData';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TemplateItem {
  icon: React.ElementType;
  label: string;
  query: string;
  color: string;
}

const templates: TemplateItem[] = [
  { icon: BarChart3, label: 'Ringkasan Penjualan Hari Ini', query: 'Tampilkan ringkasan penjualan hari ini', color: 'from-blue-500 to-indigo-600' },
  { icon: Package, label: 'Cek Stok Produk', query: 'Tampilkan stok semua produk saat ini', color: 'from-purple-500 to-violet-600' },
  { icon: DollarSign, label: 'Daftar Harga Produk', query: 'Tampilkan daftar harga jual semua produk', color: 'from-amber-500 to-orange-600' },
  { icon: Calculator, label: 'Analisis HPP & Margin', query: 'Analisis HPP dan margin semua produk', color: 'from-teal-500 to-cyan-600' },
  { icon: TrendingDown, label: 'Produk Stok Rendah', query: 'Tampilkan produk dengan stok rendah', color: 'from-red-500 to-rose-600' },
  { icon: ShoppingCart, label: 'Produk Terlaris', query: 'Tampilkan produk terlaris berdasarkan penjualan', color: 'from-green-500 to-emerald-600' },
  { icon: Users, label: 'Harga Bahan Baku', query: 'Tampilkan daftar harga bahan baku', color: 'from-pink-500 to-fuchsia-600' },
  { icon: FileText, label: 'Laporan Profit Harian', query: 'Tampilkan laporan profit harian minggu ini', color: 'from-sky-500 to-blue-600' },
];

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('ringkasan') || q.includes('penjualan hari')) {
    const totalRevenue = dailyData.reduce((s, d) => s + d.revenue, 0);
    const totalProfit = dailyData.reduce((s, d) => s + d.profit, 0);
    const totalHpp = dailyData.reduce((s, d) => s + d.hpp, 0);
    return `📊 **Ringkasan Penjualan**\n\n| Metrik | Nilai |\n|---|---|\n| Total Revenue | ${formatCurrency(totalRevenue)} |\n| Total HPP | ${formatCurrency(totalHpp)} |\n| Total Profit | ${formatCurrency(totalProfit)} |\n| Rata-rata Harian | ${formatCurrency(Math.round(totalRevenue / dailyData.length))} |\n| Margin Rata-rata | ${((totalProfit / totalRevenue) * 100).toFixed(1)}% |\n\n✅ Performa penjualan dalam kondisi baik.`;
  }

  if (q.includes('stok') && (q.includes('produk') || q.includes('semua'))) {
    const rows = products.map(p => `| ${p.emoji} ${p.name} | ${p.stockCurrent} ${p.unit} | ${p.stockCurrent < 20 ? '⚠️ Rendah' : '✅ Aman'} |`).join('\n');
    return `📦 **Stok Produk Saat Ini**\n\n| Produk | Stok | Status |\n|---|---|---|\n${rows}\n\n💡 Segera restok produk dengan status ⚠️ Rendah.`;
  }

  if (q.includes('harga') && q.includes('produk')) {
    const rows = products.map(p => `| ${p.emoji} ${p.name} | ${formatCurrency(p.sellingPrice)} | ${formatCurrency(p.hpp)} | ${p.margin}% |`).join('\n');
    return `💰 **Daftar Harga Produk**\n\n| Produk | Harga Jual | HPP | Margin |\n|---|---|---|---|\n${rows}`;
  }

  if (q.includes('hpp') || q.includes('margin')) {
    const sorted = [...products].sort((a, b) => b.margin - a.margin);
    const rows = sorted.map(p => `| ${p.emoji} ${p.name} | ${formatCurrency(p.hpp)} | ${formatCurrency(p.sellingPrice)} | **${p.margin}%** | ${formatCurrency(p.sellingPrice - p.hpp)} |`).join('\n');
    const avgMargin = (products.reduce((s, p) => s + p.margin, 0) / products.length).toFixed(1);
    return `📊 **Analisis HPP & Margin**\n\n| Produk | HPP | Harga Jual | Margin | Profit/Unit |\n|---|---|---|---|---|\n${rows}\n\n📈 Margin rata-rata: **${avgMargin}%**\n💡 Produk dengan margin tertinggi: **${sorted[0].name}** (${sorted[0].margin}%)`;
  }

  if (q.includes('stok rendah') || q.includes('low stock')) {
    const low = products.filter(p => p.stockCurrent < 20);
    if (low.length === 0) return '✅ Semua produk memiliki stok yang cukup. Tidak ada produk dengan stok rendah.';
    const rows = low.map(p => `| ${p.emoji} ${p.name} | ${p.stockCurrent} ${p.unit} | ⚠️ Perlu restok |`).join('\n');
    return `⚠️ **Produk Stok Rendah**\n\n| Produk | Stok | Status |\n|---|---|---|\n${rows}\n\n🔔 Segera lakukan pembelian bahan baku untuk produk di atas.`;
  }

  if (q.includes('terlaris') || q.includes('best seller')) {
    const sorted = [...products].sort((a, b) => b.salesCount - a.salesCount);
    const rows = sorted.map((p, i) => `| ${i + 1} | ${p.emoji} ${p.name} | ${p.salesCount} | ${formatCurrency(p.salesCount * p.sellingPrice)} |`).join('\n');
    return `🏆 **Produk Terlaris**\n\n| # | Produk | Terjual | Revenue |\n|---|---|---|---|\n${rows}\n\n🌟 Produk terlaris: **${sorted[0].name}** dengan ${sorted[0].salesCount} penjualan.`;
  }

  if (q.includes('bahan baku') || q.includes('material')) {
    const rows = rawMaterials.map(m => `| ${m.name} | ${formatCurrency(m.pricePerUnit)}/${m.unit} | ${m.stockCurrent} ${m.unit} | ${m.category} |`).join('\n');
    return `🧪 **Daftar Harga Bahan Baku**\n\n| Bahan | Harga | Stok | Kategori |\n|---|---|---|---|\n${rows}`;
  }

  if (q.includes('profit') || q.includes('harian')) {
    const rows = dailyData.map(d => `| ${d.date} | ${formatCurrency(d.revenue)} | ${formatCurrency(d.hpp)} | ${formatCurrency(d.profit)} | ${((d.profit / d.revenue) * 100).toFixed(1)}% |`).join('\n');
    return `📈 **Laporan Profit Harian**\n\n| Tanggal | Revenue | HPP | Profit | Margin |\n|---|---|---|---|---|\n${rows}\n\n💰 Total profit minggu ini: **${formatCurrency(dailyData.reduce((s, d) => s + d.profit, 0))}**`;
  }

  return `🤖 Maaf, saya belum memahami pertanyaan tersebut. Silakan gunakan salah satu template yang tersedia untuk mendapatkan informasi yang Anda butuhkan.`;
}

const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: '👋 Halo! Saya asisten AI TERATUR.ID. Pilih salah satu template di bawah untuk mendapatkan informasi bisnis Anda secara instan.', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleTemplate = (template: TemplateItem) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: template.query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(template.query);
      const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown renderer for tables and bold
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    const processInline = (line: string) => {
      return line.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const cells = trimmed.split('|').filter(c => c.trim() !== '');
        if (cells.every(c => /^[-\s:]+$/.test(c.trim()))) return; // separator
        tableRows.push(cells.map(c => c.trim()));
        inTable = true;
        return;
      }
      if (inTable) {
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-2">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">{tableRows[0]?.map((c, j) => <th key={j} className="p-2 text-left font-semibold text-muted-foreground">{processInline(c)}</th>)}</tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-border/50 hover:bg-secondary/20">
                    {row.map((c, j) => <td key={j} className="p-2">{processInline(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
      if (trimmed === '') {
        elements.push(<br key={i} />);
      } else {
        elements.push(<p key={i} className="mb-1">{processInline(trimmed)}</p>);
      }
    });

    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key="table-end" className="overflow-x-auto my-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">{tableRows[0]?.map((c, j) => <th key={j} className="p-2 text-left font-semibold text-muted-foreground">{processInline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri} className="border-b border-border/50 hover:bg-secondary/20">
                  {row.map((c, j) => <td key={j} className="p-2">{processInline(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Assistant</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Pilih template untuk mendapatkan insight bisnis
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-foreground'
                      }`}>
                        {msg.role === 'assistant' ? (
                          <div className="text-sm leading-relaxed">{renderMarkdown(msg.content)}</div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                        <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-secondary/50 rounded-2xl p-4 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">Menganalisis data...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>

          {/* Template Sidebar */}
          <div className="w-72 flex-shrink-0 hidden lg:block">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Template Pertanyaan</h3>
            <div className="space-y-2">
              {templates.map((t, i) => (
                <motion.button
                  key={t.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => handleTemplate(t)}
                  disabled={isTyping}
                  className="w-full p-3 rounded-xl border border-border/50 bg-card hover:bg-secondary/30 transition-all text-left group flex items-center gap-3 disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <t.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium flex-1">{t.label}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Templates */}
        <div className="lg:hidden mt-3">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {templates.map(t => (
                <Button
                  key={t.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplate(t)}
                  disabled={isTyping}
                  className="whitespace-nowrap flex-shrink-0 text-xs"
                >
                  <t.icon className="w-3 h-3 mr-1" />
                  {t.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default AIChat;
