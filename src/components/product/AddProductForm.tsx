import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Trash2, Package, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RawMaterial, Product, Ingredient } from '@/data/mockData';
import { toast } from 'sonner';
import { Select } from 'antd';

interface AddProductFormProps {
  rawMaterials: RawMaterial[];
  onAddProduct: (product: Product) => void;
  onClose: () => void;
}

const productCategories = ['Coffee', 'Non-Coffee', 'Tea', 'Pastry', 'Snack', 'Makanan', 'Minuman'];
const productEmojis = ['☕', '🍵', '🧋', '🥐', '🍰', '🧁', '🍪', '🍩', '🥤', '🧃', '🍔', '🍕'];
const productUnits = ['Cup', 'Pcs', 'Porsi', 'Paket', 'Box'];

export const AddProductForm = ({ rawMaterials, onAddProduct, onClose }: AddProductFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Coffee',
    emoji: '☕',
    sellingPrice: 0,
    unit: 'Cup',
    description: '',
    laborCost: 0,
    overheadCost: 0,
  });
  
  const [ingredients, setIngredients] = useState<Array<{
    materialId: string;
    amount: number;
    unit: string;
  }>>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Filter only raw materials (bahan_baku category)
  const availableMaterials = rawMaterials.filter(m => m.category === 'bahan_baku');

  // Calculate costs
  const calculatedIngredients = useMemo(() => {
    return ingredients.map(ing => {
      const material = rawMaterials.find(m => m.id === ing.materialId);
      if (!material) return null;
      
      // Convert price based on unit
      let pricePerUnit = material.pricePerUnit;
      if (material.unit === 'Kg' && ing.unit === 'g') {
        pricePerUnit = material.pricePerUnit / 1000;
      } else if (material.unit === 'Liter' && ing.unit === 'ml') {
        pricePerUnit = material.pricePerUnit / 1000;
      }
      
      return {
        id: ing.materialId,
        name: material.name,
        amount: ing.amount,
        unit: ing.unit,
        pricePerUnit,
        totalCost: pricePerUnit * ing.amount,
        category: 'raw' as const,
      };
    }).filter(Boolean) as Ingredient[];
  }, [ingredients, rawMaterials]);

  const bbbTotal = calculatedIngredients.reduce((sum, ing) => sum + ing.totalCost, 0);
  const totalHpp = bbbTotal + formData.laborCost + formData.overheadCost;
  const margin = formData.sellingPrice > 0 
    ? ((formData.sellingPrice - totalHpp) / formData.sellingPrice) * 100 
    : 0;

  const handleAddIngredient = () => {
    if (availableMaterials.length === 0) {
      toast.error('Belum ada bahan baku. Tambahkan di halaman Pengeluaran terlebih dahulu.');
      return;
    }
    setIngredients(prev => [...prev, {
      materialId: availableMaterials[0]?.id || '',
      amount: 0,
      unit: 'g',
    }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Mohon isi nama produk');
      return;
    }
    if (formData.sellingPrice <= 0) {
      toast.error('Mohon isi harga jual');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      emoji: formData.emoji,
      sellingPrice: formData.sellingPrice,
      hpp: totalHpp,
      margin: Math.round(margin * 10) / 10,
      ingredients: calculatedIngredients,
      laborCost: formData.laborCost,
      overheadCost: formData.overheadCost,
      salesCount: 0,
      stockInitial: 0,
      stockCurrent: 0,
      unit: formData.unit,
      description: formData.description,
      recipe: ingredients.map(ing => ({ ingredientId: ing.materialId, quantity: ing.amount })),
    };

    onAddProduct(newProduct);
    toast.success('Produk berhasil ditambahkan!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-card p-6 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Tambah Produk Baru</h3>
          <p className="text-sm text-muted-foreground">
            Step {step} dari 3: {step === 1 ? 'Info Dasar' : step === 2 ? 'Resep Bahan' : 'Biaya Produksi'}
          </p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              s === step 
                ? 'bg-primary text-primary-foreground' 
                : s < step 
                  ? 'bg-success text-success-foreground'
                  : 'bg-secondary text-muted-foreground'
            }`}>
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 rounded ${s < step ? 'bg-success' : 'bg-secondary'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Nama Produk
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Kopi Susu Gula Aren"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Kategori
                </label>
                <Select
                  value={formData.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  className="w-full h-10"
                  dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                  suffixIcon={<ChevronDown className="w-3 h-3" />}
                  options={productCategories.map(cat => ({ value: cat, label: cat }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {productEmojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                        formData.emoji === emoji 
                          ? 'bg-primary/20 border-2 border-primary' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Harga Jual (IDR)
                </label>
                <Input
                  type="number"
                  value={formData.sellingPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: parseInt(e.target.value) || 0 }))}
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Satuan
                </label>
                <Select
                  value={formData.unit}
                  onChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                  className="w-full h-10"
                  dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                  suffixIcon={<ChevronDown className="w-3 h-3" />}
                  options={productUnits.map(unit => ({ value: unit, label: unit }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Deskripsi Produk
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi singkat produk"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} className="gap-2">
                Lanjut ke Resep
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Recipe */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="glass-card p-4 border-l-4 border-l-primary">
              <p className="text-sm text-muted-foreground">
                Pilih bahan baku dari daftar pengeluaran dan tentukan gramasi per {formData.unit.toLowerCase()}.
                Biaya akan dihitung otomatis berdasarkan harga per unit bahan.
              </p>
            </div>

            {ingredients.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-lg">
                <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">Belum ada bahan ditambahkan</p>
                <Button onClick={handleAddIngredient} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Bahan
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {ingredients.map((ing, index) => {
                  const material = rawMaterials.find(m => m.id === ing.materialId);
                  const calculated = calculatedIngredients.find(c => c.id === ing.materialId);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-4 gap-3">
                        <Select
                          value={ing.materialId}
                          onChange={(value) => handleIngredientChange(index, 'materialId', value)}
                          className="h-10"
                          dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                          suffixIcon={<ChevronDown className="w-3 h-3" />}
                          options={availableMaterials.map(m => ({ value: m.id, label: m.name }))}
                        />
                        <Input
                          type="number"
                          value={ing.amount || ''}
                          onChange={(e) => handleIngredientChange(index, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Jumlah"
                          className="text-center h-10"
                        />
                        <Select
                          value={ing.unit}
                          onChange={(value) => handleIngredientChange(index, 'unit', value)}
                          className="h-10"
                          dropdownStyle={{ borderRadius: '12px', overflow: 'hidden' }}
                          suffixIcon={<ChevronDown className="w-3 h-3" />}
                          options={[
                            { value: 'g', label: 'gram' },
                            { value: 'ml', label: 'ml' },
                            { value: 'pcs', label: 'pcs' },
                          ]}
                        />
                        <div className="flex items-center justify-end text-right">
                          <span className="font-medium number-display text-primary">
                            {formatCurrency(calculated?.totalCost || 0)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
                
                <Button onClick={handleAddIngredient} variant="outline" className="gap-2 w-full">
                  <Plus className="w-4 h-4" />
                  Tambah Bahan Lagi
                </Button>
              </div>
            )}

            {/* Subtotal BBB */}
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <span className="font-medium">Subtotal Bahan Baku (BBB)</span>
              <span className="text-lg font-bold number-display text-primary">{formatCurrency(bbbTotal)}</span>
            </div>

            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(1)} variant="outline">
                Kembali
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Lanjut ke Biaya Produksi
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Production Costs */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Biaya Tenaga Kerja Langsung (BTKL) per {formData.unit}
                </label>
                <Input
                  type="number"
                  value={formData.laborCost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, laborCost: parseInt(e.target.value) || 0 }))}
                  placeholder="1000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Estimasi biaya tenaga kerja untuk membuat 1 {formData.unit.toLowerCase()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Biaya Overhead Produksi (BOP) per {formData.unit}
                </label>
                <Input
                  type="number"
                  value={formData.overheadCost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, overheadCost: parseInt(e.target.value) || 0 }))}
                  placeholder="500"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Listrik, air, gas, penyusutan alat per produk
                </p>
              </div>
            </div>

            {/* HPP Summary */}
            <div className="glass-card p-4 space-y-3">
              <h4 className="font-semibold">Ringkasan HPP per {formData.unit}</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bahan Baku (BBB)</span>
                  <span className="number-display">{formatCurrency(bbbTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tenaga Kerja (BTKL)</span>
                  <span className="number-display">{formatCurrency(formData.laborCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overhead (BOP)</span>
                  <span className="number-display">{formatCurrency(formData.overheadCost)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Total HPP</span>
                  <span className="number-display text-destructive">{formatCurrency(totalHpp)}</span>
                </div>
              </div>

              {/* Margin Preview */}
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-success/10 to-primary/10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Harga Jual</p>
                    <p className="font-semibold number-display">{formatCurrency(formData.sellingPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className={`text-xl font-bold number-display ${margin >= 50 ? 'text-success' : margin >= 30 ? 'text-warning' : 'text-destructive'}`}>
                      {margin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(2)} variant="outline">
                Kembali
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Check className="w-4 h-4" />
                Simpan Produk
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
