import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Calculator, Save, AlertCircle, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/data/mockData';
import { Employee } from '@/pages/Employees';
import { toast } from 'sonner';

interface BTKLAllocationProps {
  products: Product[];
  employees: Employee[];
  onUpdateProducts: (products: Product[]) => void;
  onClose: () => void;
}

interface AllocationData {
  productId: string;
  percentage: number;
}

export const BTKLAllocation = ({ products, employees, onUpdateProducts, onClose }: BTKLAllocationProps) => {
  const btklEmployees = employees.filter(e => e.isProductionLabor);
  const totalBtklDaily = btklEmployees.reduce((sum, e) => sum + e.dailyWage, 0);
  const totalBtklMonthly = totalBtklDaily * 26; // 26 working days

  // Initialize allocations from products
  const [allocations, setAllocations] = useState<AllocationData[]>(() => 
    products.map(p => ({
      productId: p.id,
      percentage: 0,
    }))
  );

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate BTKL per product based on allocation
  const calculatedProducts = useMemo(() => {
    return products.map(product => {
      const allocation = allocations.find(a => a.productId === product.id);
      const percentage = allocation?.percentage || 0;
      
      // Calculate daily BTKL for this product
      const dailyBtklForProduct = (totalBtklDaily * percentage) / 100;
      
      // Estimate production per day (from sales count / 30 days)
      const estimatedDailyProduction = Math.max(product.salesCount / 30, 1);
      
      // BTKL per unit
      const btklPerUnit = dailyBtklForProduct / estimatedDailyProduction;
      
      return {
        ...product,
        allocationPercentage: percentage,
        calculatedBtkl: Math.round(btklPerUnit),
        dailyBtkl: dailyBtklForProduct,
        estimatedDailyProduction,
      };
    });
  }, [products, allocations, totalBtklDaily]);

  const handleAllocationChange = (productId: string, value: number) => {
    setAllocations(prev => prev.map(a => 
      a.productId === productId ? { ...a, percentage: Math.min(100, Math.max(0, value)) } : a
    ));
  };

  const handleDistributeEvenly = () => {
    const evenPercentage = 100 / products.length;
    setAllocations(products.map(p => ({
      productId: p.id,
      percentage: Math.round(evenPercentage * 100) / 100,
    })));
  };

  const handleDistributeBySales = () => {
    const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);
    if (totalSales === 0) {
      toast.error('Tidak ada data penjualan untuk alokasi');
      return;
    }
    
    setAllocations(products.map(p => ({
      productId: p.id,
      percentage: Math.round((p.salesCount / totalSales) * 100 * 100) / 100,
    })));
  };

  const handleSave = () => {
    if (!isValid) {
      toast.error('Total alokasi harus 100%');
      return;
    }

    const updatedProducts = products.map(product => {
      const calculated = calculatedProducts.find(p => p.id === product.id);
      const newLaborCost = calculated?.calculatedBtkl || product.laborCost;
      
      // Recalculate HPP
      const bbbTotal = product.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0);
      const newHpp = bbbTotal + newLaborCost + product.overheadCost;
      const newMargin = product.sellingPrice > 0 
        ? ((product.sellingPrice - newHpp) / product.sellingPrice) * 100 
        : 0;

      return {
        ...product,
        laborCost: newLaborCost,
        hpp: newHpp,
        margin: Math.round(newMargin * 10) / 10,
      };
    });

    onUpdateProducts(updatedProducts);
    toast.success('Alokasi BTKL berhasil disimpan!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Alokasi BTKL ke Produk</h3>
              <p className="text-sm text-muted-foreground">
                Tentukan persentase alokasi biaya tenaga kerja ke setiap produk
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">
            ×
          </button>
        </div>

        {/* BTKL Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 border-l-4 border-l-success">
            <p className="text-sm text-muted-foreground">Total Karyawan BTKL</p>
            <p className="text-2xl font-bold">{btklEmployees.length}</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-primary">
            <p className="text-sm text-muted-foreground">Total BTKL / Hari</p>
            <p className="text-2xl font-bold number-display">{formatCurrency(totalBtklDaily)}</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-warning">
            <p className="text-sm text-muted-foreground">Total BTKL / Bulan</p>
            <p className="text-2xl font-bold number-display">{formatCurrency(totalBtklMonthly)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={handleDistributeEvenly} className="gap-2">
            <Percent className="w-4 h-4" />
            Bagi Rata
          </Button>
          <Button variant="outline" size="sm" onClick={handleDistributeBySales} className="gap-2">
            <Calculator className="w-4 h-4" />
            Berdasarkan Penjualan
          </Button>
        </div>

        {/* Allocation Table */}
        <div className="glass-card overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Produk</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Penjualan</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Alokasi (%)</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">BTKL/Hari</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">BTKL/Unit</th>
              </tr>
            </thead>
            <tbody>
              {calculatedProducts.map((product, index) => {
                const allocation = allocations.find(a => a.productId === product.id);
                
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border hover:bg-secondary/30"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.emoji}</span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="number-display">{product.salesCount}/bln</span>
                      <p className="text-xs text-muted-foreground">
                        ~{Math.round(product.estimatedDailyProduction)}/hari
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Input
                          type="number"
                          value={allocation?.percentage || 0}
                          onChange={(e) => handleAllocationChange(product.id, parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="number-display text-primary">
                        {formatCurrency(product.dailyBtkl)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="number-display font-semibold text-success">
                        {formatCurrency(product.calculatedBtkl)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        vs {formatCurrency(product.laborCost)} saat ini
                      </p>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total Percentage */}
        <div className={`glass-card p-4 mb-6 ${isValid ? 'border-l-4 border-l-success' : 'border-l-4 border-l-destructive'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isValid && <AlertCircle className="w-5 h-5 text-destructive" />}
              <span className="font-medium">Total Alokasi</span>
            </div>
            <span className={`text-2xl font-bold number-display ${isValid ? 'text-success' : 'text-destructive'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          {!isValid && (
            <p className="text-sm text-destructive mt-2">
              Total alokasi harus tepat 100%. Selisih: {(100 - totalPercentage).toFixed(1)}%
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="gap-2">
            <Save className="w-4 h-4" />
            Simpan Alokasi
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
