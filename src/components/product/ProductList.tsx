import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, Plus, Edit2, Users, Search, Filter, Trash2, Download } from 'lucide-react';
import { products as initialProducts, rawMaterials, Product } from '@/data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddProductForm } from './AddProductForm';
import { EditProductForm } from './EditProductForm';
import { BTKLAllocation } from './BTKLAllocation';
import { Employee } from '@/pages/Employees';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Default employees for BTKL allocation
const defaultEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ahmad Barista',
    position: 'Barista',
    dailyWage: 150000,
    monthlyWage: 3900000,
    wageType: 'daily',
    isProductionLabor: true,
    department: 'Produksi',
    phone: '081234567890',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Budi Chef',
    position: 'Chef Pastry',
    dailyWage: 200000,
    monthlyWage: 5200000,
    wageType: 'daily',
    isProductionLabor: true,
    department: 'Produksi',
    phone: '081234567892',
    joinDate: '2024-01-20',
  },
];

export const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showBtklAllocation, setShowBtklAllocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Load products from localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem('teratur_products');
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem('teratur_products', JSON.stringify(initialProducts));
    }
  }, []);

  const saveProducts = (data: Product[]) => {
    setProducts(data);
    localStorage.setItem('teratur_products', JSON.stringify(data));
  };

  // Load employees from localStorage
  useEffect(() => {
    const storedEmployees = localStorage.getItem('teratur_employees');
    if (storedEmployees) {
      try {
        setEmployees(JSON.parse(storedEmployees));
      } catch {
        // Use default employees
      }
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddProduct = (newProduct: Product) => {
    const updated = [...products, newProduct];
    saveProducts(updated);
    toast.success('Produk berhasil ditambahkan');
  };

  const handleEditProduct = (updatedProduct: Product) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveProducts(updated);
    toast.success('Produk berhasil diperbarui');
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      const updated = products.filter(p => p.id !== productToDelete.id);
      saveProducts(updated);
      toast.success(`Produk ${productToDelete.name} berhasil dihapus`);
      setProductToDelete(null);
    }
  };

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    saveProducts(updatedProducts);
  };

  const btklEmployees = employees.filter(e => e.isProductionLabor);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    toast.info('Mengekspor data produk...');
    setTimeout(() => {
      toast.success('Data produk berhasil diekspor (Excel)');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produk</h1>
          <p className="text-muted-foreground">Kelola produk dan lihat analisis HPP</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowBtklAllocation(true)} 
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Alokasi BTKL
          </Button>
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize whitespace-nowrap"
            >
              {cat === 'all' ? 'Semua' : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* BTKL Summary */}
      {btklEmployees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 border-l-4 border-l-primary"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Total BTKL: {btklEmployees.length} karyawan</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(btklEmployees.reduce((sum, e) => sum + e.dailyWage, 0))}/hari
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBtklAllocation(true)}
              className="text-primary"
            >
              Kelola Alokasi
            </Button>
          </div>
        </motion.div>
      )}

      {/* Add Product Form */}
      <AnimatePresence>
        {isAdding && (
          <AddProductForm
            rawMaterials={rawMaterials}
            onAddProduct={handleAddProduct}
            onClose={() => setIsAdding(false)}
          />
        )}
      </AnimatePresence>

      {/* Edit Product Form */}
      <AnimatePresence>
        {editingProduct && (
          <EditProductForm
            product={editingProduct}
            rawMaterials={rawMaterials}
            onSaveProduct={handleEditProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* BTKL Allocation Modal */}
      <AnimatePresence>
        {showBtklAllocation && (
          <BTKLAllocation
            products={products}
            employees={employees}
            onUpdateProducts={handleUpdateProducts}
            onClose={() => setShowBtklAllocation(false)}
          />
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card p-5 flex items-center gap-5 hover:border-primary/30 transition-all duration-300 group"
          >
            <Link
              to={`/product/${product.id}`}
              className="flex items-center gap-5 flex-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {product.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.salesCount} terjual
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Harga Jual</p>
                  <p className="font-semibold number-display">{formatCurrency(product.sellingPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">HPP</p>
                  <p className="font-semibold number-display text-destructive">{formatCurrency(product.hpp)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Margin</p>
                  <div className="flex items-center justify-center gap-1 text-success">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-semibold number-display">{product.margin}%</span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setEditingProduct(product);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setProductToDelete(product);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/product/${product.id}`)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk <strong>{productToDelete?.name}</strong> dari sistem secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
