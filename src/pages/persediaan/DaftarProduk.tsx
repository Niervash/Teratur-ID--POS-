import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, Search, Plus, AlertTriangle, 
  ArrowUp, RefreshCcw, Filter, ChevronDown, Trash2
} from 'lucide-react';
import { ingredients as initialIngredients, Ingredient } from '@/data/mockData';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Modal, Select, InputNumber, Form, Input as AntdInput } from 'antd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  
  // Modal State
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [restockForm] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const backendIngredients = await api.get<any[]>('/inventory/ingredients');
        const formatted = backendIngredients.map(m => ({
          ...m,
          stock: Number(m.stock),
          minStock: Number(m.minStock),
          avgCost: Number(m.avgCost),
          // Ensure compatibility with Ingredient interface
          stockCurrent: Number(m.stock),
          pricePerUnit: Number(m.avgCost),
        }));
        setIngredients(formatted);
        localStorage.setItem('teratur_expenses', JSON.stringify(formatted));
      } catch (error) {
        console.error('Failed to fetch ingredients:', error);
        const stored = localStorage.getItem('teratur_expenses');
        if (stored) {
          setIngredients(JSON.parse(stored));
        } else {
          setIngredients(initialIngredients);
        }
      }
    };

    fetchIngredients();
  }, []);

  const saveIngredients = async (data: Ingredient[]) => {
    // This is called when adding/updating local state
    setIngredients(data);
    localStorage.setItem('teratur_expenses', JSON.stringify(data));
  };

  const onAddIngredient = async (values: any) => {
    try {
      const newIng: Ingredient = {
        id: `ing-${Date.now()}`,
        name: values.name,
        unit: values.unit,
        stock: values.stock || 0,
        minStock: values.minStock || 0,
        avgCost: values.avgCost || 0,
        category: values.category || 'bahan_baku',
        stockCurrent: values.stock || 0,
        pricePerUnit: values.avgCost || 0,
      };

      // 1. Sync to Backend
      await api.post('/inventory/ingredients', {
        id: newIng.id,
        name: newIng.name,
        unit: newIng.unit,
        stock: newIng.stock,
        minStock: newIng.minStock,
        avgCost: newIng.avgCost,
      });

      // 2. Update Local
      saveIngredients([newIng, ...ingredients]);
      setIsAddModalOpen(false);
      addForm.resetFields();
      toast.success('Bahan baku berhasil disimpan ke database');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan bahan baku ke database');
    }
  };

  const handleRestock = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsRestockModalOpen(true);
    restockForm.resetFields();
  };

  const handleConfirmRestock = () => {
    restockForm.validateFields().then(values => {
      if (!selectedIngredient) return;

      const updated = ingredients.map(ing => 
        ing.id === selectedIngredient.id ? { ...ing, stock: ing.stock + values.jumlah } : ing
      );
      saveIngredients(updated);
      toast.success(`Berhasil menambah stok ${selectedIngredient.name}!`);
      setIsRestockModalOpen(false);
    });
  };

  const handleAddNew = () => {
    addForm.validateFields().then(values => {
      const newIngredient: Ingredient = {
        id: `ing-${Date.now()}`,
        name: values.name,
        category: values.category,
        stock: values.stock || 0,
        minStock: values.minStock || 0,
        unit: values.unit,
        avgCost: values.avgCost || 0
      };

      const updated = [newIngredient, ...ingredients];
      saveIngredients(updated);
      toast.success(`Bahan ${values.name} berhasil ditambahkan!`);
      setIsAddModalOpen(false);
      addForm.resetFields();
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus bahan ${name}?`)) {
      const updated = ingredients.filter(i => i.id !== id);
      saveIngredients(updated);
      toast.success(`Bahan ${name} dihapus.`);
    }
  };

  const categories = ['Semua', ...new Set(ingredients.map(i => i.category))];

  const filteredIngredients = ingredients.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Semua' || i.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Stok Bahan Baku</h1>
            <p className="text-muted-foreground text-sm">Pantau ketersediaan bahan dan HPP per unit secara real-time.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="rounded-xl gap-2 h-11"
              onClick={() => {
                saveIngredients(initialIngredients);
                toast.info("Data disinkronkan ke default");
              }}
            >
              <RefreshCcw className="w-4 h-4" /> Reset Data
            </Button>
            <Button 
              className="rounded-xl gap-2 h-11 shadow-lg shadow-primary/20"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4" /> Tambah Bahan
            </Button>
          </div>
        </div>

        {/* ALERTS FOR LOW STOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.filter(i => i.stock <= i.minStock).slice(0, 3).map(ing => (
            <Card key={ing.id} className="border-warning/30 bg-warning/5 rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-warning/80">Stok Menipis!</p>
                  <p className="font-bold truncate">{ing.name}</p>
                </div>
                <Button size="sm" variant="warning" className="h-8 rounded-lg" onClick={() => handleRestock(ing)}>Restock</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50 bg-card rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
          <CardHeader className="border-b border-border/30 bg-secondary/10 flex flex-row items-center justify-between p-6 gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari bahan..." 
                className="pl-9 h-11 rounded-xl bg-background/50 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2 h-11">
                  <Filter className="w-4 h-4" /> 
                  {filterCategory === 'Semua' ? 'Filter Kategori' : filterCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl">
                <DropdownMenuLabel>Pilih Kategori</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterCategory} onValueChange={setFilterCategory}>
                  {categories.map(cat => (
                    <DropdownMenuRadioItem key={cat} value={cat} className="rounded-lg">
                      {cat}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] pl-8">Nama Bahan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok Tersedia</TableHead>
                  <TableHead>Min. Stok</TableHead>
                  <TableHead>HPP per Unit</TableHead>
                  <TableHead className="text-right pr-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.length > 0 ? (
                  filteredIngredients.map((ing) => (
                    <TableRow key={ing.id} className="group transition-colors">
                      <TableCell className="pl-8 py-4 font-bold text-foreground">{ing.name}</TableCell>
                      <TableCell><Badge variant="secondary" className="rounded-lg uppercase text-[10px]">{ing.category}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-black ${ing.stock <= ing.minStock ? 'text-destructive' : 'text-foreground'}`}>
                            {ing.stock.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{ing.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium italic">{ing.minStock} {ing.unit}</TableCell>
                      <TableCell className="font-bold text-success">Rp {ing.avgCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="rounded-lg h-8 px-4" onClick={() => handleRestock(ing)}>
                            <ArrowUp className="w-3.5 h-3.5 mr-1.5" /> Entry Belanja
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-lg h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(ing.id, ing.name)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Tidak ada bahan ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* MODAL ENTRY BELANJA (RESTOCK) */}
      <Modal
        title={`Entry Belanja - ${selectedIngredient?.name}`}
        open={isRestockModalOpen}
        onOk={handleConfirmRestock}
        onCancel={() => setIsRestockModalOpen(false)}
        okText="Simpan Stok"
        cancelText="Batal"
        centered
        className="rounded-2xl"
      >
        <Form form={restockForm} layout="vertical" className="pt-4">
          <Form.Item name="jumlah" label="Jumlah Masuk" rules={[{ required: true, message: 'Masukkan jumlah!' }]}>
            <InputNumber className="w-full h-10 rounded-lg" min={1} placeholder="Contoh: 10" />
          </Form.Item>
          <Form.Item name="supplier" label="Supplier">
            <Select 
              className="w-full h-10"
              suffixIcon={<ChevronDown className="w-3 h-3" />}
              options={[
                { value: 'supplier_a', label: 'Supplier Utama A' },
                { value: 'supplier_b', label: 'Supplier Lokal B' },
              ]}
              placeholder="Pilih Supplier"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL TAMBAH BAHAN BARU */}
      <Modal
        title="Tambah Bahan Baku Baru"
        open={isAddModalOpen}
        onOk={handleAddNew}
        onCancel={() => setIsAddModalOpen(false)}
        okText="Tambahkan Bahan"
        cancelText="Batal"
        centered
        className="rounded-2xl"
      >
        <Form form={addForm} layout="vertical" className="pt-4" initialValues={{ category: 'Protein', unit: 'Kg' }}>
          <Form.Item name="name" label="Nama Bahan" rules={[{ required: true, message: 'Nama wajib diisi!' }]}>
            <AntdInput className="h-10 rounded-lg" placeholder="Contoh: Daging Sapi" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Kategori" rules={[{ required: true }]}>
              <Select className="h-10" options={[
                { value: 'Protein', label: 'Protein' },
                { value: 'Sayuran', label: 'Sayuran' },
                { value: 'Bumbu', label: 'Bumbu' },
                { value: 'Karbohidrat', label: 'Karbohidrat' },
              ]} />
            </Form.Item>
            <Form.Item name="unit" label="Satuan" rules={[{ required: true }]}>
              <Select className="h-10" options={[
                { value: 'Kg', label: 'Kilogram (Kg)' },
                { value: 'Gr', label: 'Gram (Gr)' },
                { value: 'Ltr', label: 'Liter (Ltr)' },
                { value: 'Pcs', label: 'Pieces (Pcs)' },
              ]} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="stock" label="Stok Awal">
              <InputNumber className="w-full h-10" min={0} />
            </Form.Item>
            <Form.Item name="minStock" label="Batas Minimum">
              <InputNumber className="w-full h-10" min={0} />
            </Form.Item>
          </div>
          <Form.Item name="avgCost" label="Harga per Unit (HPP)">
            <InputNumber className="w-full h-10" min={0} prefix="Rp" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Ingredients;
