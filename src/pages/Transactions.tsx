import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { products, Product, ingredients } from '@/data/mockData';
import { Member } from './Members';
import { 
  Plus, Minus, Trash2, CreditCard, Banknote, 
  Receipt, ShoppingCart, QrCode, Utensils, 
  ShoppingBag, Search, Filter, Coffee, Pizza, 
  IceCream, Wine, ChevronRight, Menu, LayoutDashboard,
  Truck, Bike, UserPlus, UserCheck, X, LogOut, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { Select, Modal, InputNumber } from 'antd';
import { printReceipt } from '@/lib/printerUtils';

interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

interface ShiftData {
  id: string;
  startTime: string;
  endTime?: string;
  initialCash: number;
  finalCash?: number;
  expectedCash?: number;
  cashierName: string;
  status: 'open' | 'closed';
}

const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: Coffee },
  { id: 'Coffee', label: 'Coffee', icon: Coffee },
  { id: 'Bakery', label: 'Bakery', icon: Pizza },
  { id: 'Drink', label: 'Minuman', icon: Wine },
  { id: 'Food', label: 'Makanan', icon: Utensils },
];

const Transactions = () => {
  const { user, hasFeature, addAuditLog } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'dine-in' | 'take-away' | 'delivery'>('dine-in');
  const [deliveryPlatform, setDeliveryPlatform] = useState<string>('GoFood');
  const [tableNumber, setTableNumber] = useState('');
  const [onlineOrderId, setOnlineOrderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPOSMode, setIsPOSMode] = useState(true);
  
  // Shift States
  const [activeShift, setActiveShift] = useState<ShiftData | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
  const [initialCashInput, setInitialCashInput] = useState<number>(0);
  const [finalCashInput, setFinalCashInput] = useState<number>(0);

  // Member States
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberResults, setShowMemberResults] = useState(false);

  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  
  const isMobile = useIsMobile();
  
  const canUseDelivery = hasFeature('online-delivery');
  const canUseMembership = hasFeature('membership');

  // Load Shift from LocalStorage
  useEffect(() => {
    const savedShift = localStorage.getItem('teratur_active_shift');
    if (savedShift) {
      setActiveShift(JSON.parse(savedShift));
    } else {
      setIsShiftModalOpen(true);
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

  const handleStartShift = () => {
    if (initialCashInput < 0) {
      toast.error('Modal awal tidak valid');
      return;
    }
    const newShift: ShiftData = {
      id: `SH-${Date.now()}`,
      startTime: new Date().toISOString(),
      initialCash: initialCashInput,
      cashierName: user?.name || 'Kasir',
      status: 'open'
    };
    setActiveShift(newShift);
    localStorage.setItem('teratur_active_shift', JSON.stringify(newShift));
    addAuditLog('Buka Shift', `Modal Awal: ${formatCurrency(initialCashInput)}`, 'access');
    setIsShiftModalOpen(false);
    toast.success('Shift berhasil dibuka! Selamat bertugas.');
  };

  const handleEndShift = () => {
    const totalSales = JSON.parse(localStorage.getItem('teratur_today_sales') || '0');
    const expected = (activeShift?.initialCash || 0) + totalSales;
    
    const closedShift: ShiftData = {
      ...activeShift!,
      endTime: new Date().toISOString(),
      finalCash: finalCashInput,
      expectedCash: expected,
      status: 'closed'
    };

    addAuditLog('Tutup Shift', `Fisik: ${formatCurrency(finalCashInput)} | Ekspektasi: ${formatCurrency(expected)}`, 'access');

    // Save to history (mock)
    const shiftHistory = JSON.parse(localStorage.getItem('teratur_shift_history') || '[]');
    localStorage.setItem('teratur_shift_history', JSON.stringify([...shiftHistory, closedShift]));
    
    // Clear active shift
    localStorage.removeItem('teratur_active_shift');
    localStorage.removeItem('teratur_today_sales');
    setActiveShift(null);
    setIsCloseShiftModalOpen(false);
    setIsShiftModalOpen(true);
    
    const diff = finalCashInput - expected;
    if (diff === 0) {
      toast.success('Shift ditutup. Kas sesuai!');
    } else if (diff > 0) {
      toast.warning(`Shift ditutup. Ada kelebihan kas: ${formatCurrency(diff)}`);
    } else {
      toast.error(`Shift ditutup. Ada kekurangan kas: ${formatCurrency(Math.abs(diff))}`);
    }
  };

  const addToCart = (product: Product) => {
    if (!activeShift) {
      setIsShiftModalOpen(true);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} ditambahkan`, { 
      icon: <ShoppingCart className="w-4 h-4" />,
      duration: 1000 
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const memberDiscount = selectedMember ? subtotal * 0.05 : 0; // 5% Discount
  const tax = (subtotal - memberDiscount) * 0.1; // 10% PB1/Tax
  const total = subtotal - memberDiscount + tax;

  const handleOpenPayment = () => {
    if (!activeShift) {
      setIsShiftModalOpen(true);
      return;
    }
    if (cart.length === 0) {
      toast.error('Pilih menu terlebih dahulu!');
      return;
    }
    if (orderType === 'dine-in' && !tableNumber) {
      toast.error('Mohon isi nomor meja!');
      return;
    }
    setReceivedAmount(0);
    setIsPaymentModalOpen(true);
  };

  const handleFinalPayment = () => {
    if (paymentMethod === 'cash' && receivedAmount < total) {
      toast.error('Uang diterima kurang!');
      return;
    }

    // Check Stock logic
    const currentIngredients = JSON.parse(localStorage.getItem('teratur_ingredients') || JSON.stringify(ingredients));
    let isStockEnough = true;
    let insufficientIngredient = "";

    cart.forEach(item => {
      item.product.recipe.forEach(recipeItem => {
        const ing = currentIngredients.find((i: any) => i.id === recipeItem.ingredientId);
        if (ing && ing.stock < (recipeItem.quantity * item.quantity)) {
          isStockEnough = false;
          insufficientIngredient = ing.name;
        }
      });
    });

    if (!isStockEnough) {
      toast.error(`Stok tidak cukup: ${insufficientIngredient}`);
      return;
    }

    const updatedIngredients = currentIngredients.map((ing: any) => {
      let totalUsage = 0;
      cart.forEach(item => {
        const recipeMatch = item.product.recipe.find(r => r.ingredientId === ing.id);
        if (recipeMatch) {
          totalUsage += (recipeMatch.quantity * item.quantity);
        }
      });
      return { ...ing, stock: ing.stock - totalUsage };
    });

    localStorage.setItem('teratur_ingredients', JSON.stringify(updatedIngredients));
    
    // Record sale for shift reconciliation
    if (paymentMethod === 'cash') {
      const currentSales = JSON.parse(localStorage.getItem('teratur_today_sales') || '0');
      localStorage.setItem('teratur_today_sales', JSON.stringify(currentSales + total));
    }

    const trxId = `TRX-${Date.now()}`;
    addAuditLog('Transaksi Berhasil', `${trxId} | Total: ${formatCurrency(total)}`, 'create');

    // Add points to member if selected
    if (selectedMember) {
      const earnedPoints = Math.floor((subtotal - memberDiscount) / 10000);
      const allMembers = JSON.parse(localStorage.getItem('teratur_members') || '[]');
      const updatedMembers = allMembers.map((m: Member) => 
        m.id === selectedMember.id ? { ...m, points: m.points + earnedPoints } : m
      );
      localStorage.setItem('teratur_members', JSON.stringify(updatedMembers));
      toast.success(`Berhasil! Member mendapatkan ${earnedPoints} point.`);
    }

    const deliveryInfo = orderType === 'delivery' ? ` via ${deliveryPlatform}` : '';
    toast.success(`Transaksi ${paymentMethod.toUpperCase()}${deliveryInfo} Berhasil!`);
    
    // Real Printing
    printReceipt({
      id: trxId,
      cashier: user?.name,
      items: cart,
      total: total,
      method: paymentMethod.toUpperCase(),
      received: paymentMethod === 'cash' ? receivedAmount : total,
      change: paymentMethod === 'cash' ? Math.max(0, receivedAmount - total) : 0
    });

    clearCart();
    setTableNumber('');
    setOnlineOrderId('');
    setSelectedMember(null);
    setIsPaymentModalOpen(false);
  };

  const findMember = () => {
    const allMembers = JSON.parse(localStorage.getItem('teratur_members') || '[]');
    return allMembers.filter((m: Member) => 
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
      m.phone.includes(memberSearch)
    );
  };

  const handlePrintReceipt = () => {
    if (cart.length === 0) {
      toast.error('Keranjang kosong, tidak ada yang bisa dicetak.');
      return;
    }
    toast.info("Menyiapkan struk...", {
      icon: <Receipt className="w-4 h-4" />,
    });
    setTimeout(() => {
      toast.success("Struk berhasil dicetak!");
    }, 1500);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout hideHeader={isPOSMode} hideSidebar={isPOSMode}>
      <div className={`flex flex-col md:flex-row gap-4 lg:gap-6 ${isPOSMode ? 'h-screen p-4' : 'h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)]'}`}>
        {/* Left Side: Product Selection */}
        <div className="flex-1 flex flex-col min-w-0 space-y-4 lg:space-y-6 relative">
          {!activeShift && isPOSMode && (
            <div className="absolute inset-0 z-40 bg-background/60 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center p-6 text-center">
              <div className="max-w-xs space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Shift Belum Dibuka</h3>
                <p className="text-sm text-muted-foreground">Silakan buka shift untuk mulai melayani pelanggan dan mencatat transaksi.</p>
                <Button onClick={() => setIsShiftModalOpen(true)} className="w-full rounded-xl">Buka Shift Sekarang</Button>
              </div>
            </div>
          )}

          {/* Top Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {isPOSMode && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setIsPOSMode(false)}
                    className="rounded-xl border-border/50 hover:bg-secondary/50 flex-shrink-0 h-9 w-9"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
                <div className="min-w-0 overflow-hidden">
                  <h1 className="text-lg md:text-xl font-bold tracking-tight truncate leading-tight">Menu Utama</h1>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                    {activeShift ? `Shift Aktif: ${activeShift.cashierName}` : 'Pilih menu untuk pelanggan'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!isPOSMode && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsPOSMode(true)}
                    className="hidden sm:flex items-center gap-2 rounded-xl border-primary/20 text-primary flex-shrink-0 h-9"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Full POS
                  </Button>
                )}
                <div className="relative flex-1 sm:w-48 md:w-56 lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input 
                    placeholder="Cari menu..." 
                    className="pl-9 h-9 md:h-10 bg-card/50 rounded-xl text-xs md:text-sm w-full border-border/30 focus:border-primary/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category Segmentation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-card border-border/30 text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5 lg:w-4 h-4" />
                  <span className="text-xs lg:text-sm font-bold">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1 lg:pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-4 pb-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  className="group relative bg-card border border-border/30 rounded-2xl lg:rounded-3xl p-2.5 lg:p-3 cursor-pointer transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="aspect-square rounded-xl lg:rounded-2xl bg-secondary/30 flex items-center justify-center text-3xl lg:text-4xl mb-2 lg:mb-3 border border-border/5 group-hover:bg-primary/5 transition-colors">
                    {product.emoji}
                  </div>
                  <div className="space-y-0.5 lg:space-y-1 px-1 text-center">
                    <h3 className="font-bold text-[10px] lg:text-xs line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] lg:text-xs font-black text-primary">{formatCurrency(product.sellingPrice)}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-3.5 h-3.5 lg:w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full md:w-[320px] lg:w-[380px] xl:w-[400px] flex flex-col bg-card border border-border/30 rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl flex-shrink-0">
          {/* Header Summary */}
          <div className="p-4 lg:p-6 bg-secondary/20 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-primary flex items-center justify-center text-white">
                <ShoppingCart className="w-4 h-4 lg:w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm lg:text-lg leading-none">Order Basket</h2>
                <span className="text-[8px] lg:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{cart.length} ITEMS SELECTED</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {activeShift && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsCloseShiftModalOpen(true)} 
                  className="h-8 w-8 text-muted-foreground hover:text-warning"
                  title="Akhiri Shift"
                >
                  <LogOut className="w-3.5 h-3.5 lg:w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handlePrintReceipt} className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Receipt className="w-3.5 h-3.5 lg:w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={clearCart} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5 lg:w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Order Settings */}
          <div className="p-3 lg:p-4 space-y-2 lg:space-y-3">
            {/* Member Selection */}
            {canUseMembership && (
              <div className="relative">
                {!selectedMember ? (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input 
                      placeholder="Cari Member (Nama/HP)..." 
                      className="pl-9 h-9 rounded-xl text-xs bg-primary/5 border-primary/20"
                      value={memberSearch}
                      onChange={(e) => {
                        setMemberSearch(e.target.value);
                        setShowMemberResults(e.target.value.length > 0);
                      }}
                    />
                    {showMemberResults && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border shadow-xl rounded-xl z-50 max-h-40 overflow-y-auto p-1">
                        {findMember().length > 0 ? findMember().map((m: Member) => (
                          <div 
                            key={m.id} 
                            className="p-2 hover:bg-secondary rounded-lg cursor-pointer flex justify-between items-center"
                            onClick={() => {
                              setSelectedMember(m);
                              setShowMemberResults(false);
                              setMemberSearch('');
                              toast.success(`Member ${m.name} dipilih (Diskon 5% Aktif)`);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold">{m.name}</span>
                              <span className="text-[8px] text-muted-foreground">{m.phone}</span>
                            </div>
                            <Badge className="text-[8px] h-4">{m.level}</Badge>
                          </div>
                        )) : (
                          <div className="p-3 text-center text-[10px] text-muted-foreground italic">
                            Member tidak ditemukan
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <UserCheck className="w-3 h-3" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold leading-none">{selectedMember.name}</span>
                        <span className="text-[8px] text-primary/70 font-medium">Diskon Member 5% Aktif</span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedMember(null)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex p-1 bg-secondary/30 rounded-xl lg:rounded-2xl border border-border/30 gap-1">
              <button 
                className={`flex-1 flex items-center justify-center gap-1.5 lg:gap-2 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-bold transition-all ${orderType === 'dine-in' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground'}`}
                onClick={() => setOrderType('dine-in')}
              >
                <Utensils className="w-3 h-3 lg:w-3.5 h-3.5" /> Dine In
              </button>
              <button 
                className={`flex-1 flex items-center justify-center gap-1.5 lg:gap-2 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-bold transition-all ${orderType === 'take-away' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground'}`}
                onClick={() => setOrderType('take-away')}
              >
                <ShoppingBag className="w-3 h-3 lg:w-3.5 h-3.5" /> Take Away
              </button>
              {canUseDelivery && (
                <button 
                  className={`flex-1 flex items-center justify-center gap-1.5 lg:gap-2 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-bold transition-all ${orderType === 'delivery' ? 'bg-orange-500 shadow-md text-white' : 'text-muted-foreground'}`}
                  onClick={() => setOrderType('delivery')}
                >
                  <Bike className="w-3 h-3 lg:w-3.5 h-3.5" /> Online
                </button>
              )}
            </div>
            
            {orderType === 'dine-in' && (
              <Input 
                placeholder="No. Meja" 
                className="h-9 lg:h-10 rounded-lg lg:rounded-xl text-center font-bold text-xs lg:text-sm"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            )}

            {orderType === 'delivery' && (
              <div className="flex gap-2">
                <Select 
                  className="flex-1 h-9 lg:h-10 rounded-lg"
                  value={deliveryPlatform}
                  onChange={setDeliveryPlatform}
                  options={[
                    { value: 'GoFood', label: 'GoFood' },
                    { value: 'GrabFood', label: 'GrabFood' },
                    { value: 'ShopeeFood', label: 'ShopeeFood' },
                  ]}
                />
                <Input 
                  placeholder="ID Pesanan (Opsional)" 
                  className="flex-1 h-9 lg:h-10 rounded-lg lg:rounded-xl text-xs lg:text-sm"
                  value={onlineOrderId}
                  onChange={(e) => setOnlineOrderId(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-3 lg:px-4 space-y-3 lg:space-y-4 custom-scrollbar">
            <AnimatePresence>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8 lg:py-12">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-6 h-6 lg:w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-xs lg:text-sm font-medium">Keranjang masih kosong</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    className="p-2.5 lg:p-3 rounded-xl lg:rounded-2xl bg-secondary/10 border border-border/10 space-y-2 lg:space-y-3"
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-background flex items-center justify-center text-lg lg:text-xl shadow-sm">
                        {item.product.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[10px] lg:text-xs truncate">{item.product.name}</p>
                        <p className="text-[9px] lg:text-[10px] text-primary font-black">
                          {formatCurrency(item.product.sellingPrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 lg:gap-3 bg-background rounded-full px-1.5 lg:px-2 py-0.5 lg:py-1 shadow-sm border border-border/5">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="text-muted-foreground hover:text-primary p-0.5"><Minus className="w-2.5 h-2.5 lg:w-3 h-3" /></button>
                        <span className="text-[10px] lg:text-xs font-black w-3 lg:w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="text-muted-foreground hover:text-primary p-0.5"><Plus className="w-2.5 h-2.5 lg:w-3 h-3" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Total & Payment */}
          <div className="p-4 lg:p-6 bg-card border-t border-border/30 space-y-4 lg:space-y-6">
            <div className="space-y-1 lg:space-y-2 px-1">
              <div className="flex justify-between text-[10px] lg:text-xs text-muted-foreground font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {selectedMember && (
                <div className="flex justify-between text-[10px] lg:text-xs text-emerald-600 font-bold">
                  <span>Diskon Member (5%)</span>
                  <span>-{formatCurrency(memberDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[10px] lg:text-xs text-muted-foreground font-medium">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 lg:pt-2">
                <span className="font-black text-xs lg:text-sm uppercase tracking-wider">Total</span>
                <span className="text-xl lg:text-2xl font-black text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:gap-3">
              <Button 
                className="w-full h-11 lg:h-14 rounded-xl lg:rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-between px-4 lg:px-6 group"
                onClick={handleOpenPayment}
              >
                <div className="flex items-center gap-2 lg:gap-3">
                  <Banknote className="w-4 h-4 lg:w-5 h-5" />
                  <span className="font-black text-xs lg:text-sm">BAYAR</span>
                </div>
                <ChevronRight className="w-4 h-4 lg:w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SHIFT OPEN MODAL */}
      <Modal
        title={null}
        open={isShiftModalOpen}
        closable={false}
        footer={null}
        centered
        width={400}
      >
        <div className="p-4 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Banknote className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-black mb-2">Buka Shift Kasir</h2>
          <p className="text-sm text-muted-foreground mb-6">Masukkan modal awal uang di laci kasir (Cash Drawer).</p>
          
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Modal Awal (Tunai)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">Rp</span>
                <InputNumber
                  className="w-full h-12 rounded-xl text-lg font-black pl-10 pt-1 border-primary/20 bg-primary/5"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  value={initialCashInput}
                  onChange={(val) => setInitialCashInput(val || 0)}
                  autoFocus
                />
              </div>
            </div>
            
            <Button 
              className="w-full h-12 rounded-2xl font-black text-sm shadow-lg shadow-primary/20"
              onClick={handleStartShift}
            >
              MULAI TUGAS
            </Button>
          </div>
        </div>
      </Modal>

      {/* SHIFT CLOSE MODAL */}
      <Modal
        title={null}
        open={isCloseShiftModalOpen}
        onCancel={() => setIsCloseShiftModalOpen(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="p-4 text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-xl font-black mb-2">Akhiri Shift</h2>
          <p className="text-sm text-muted-foreground mb-6">Hitung total uang fisik yang ada di laci kasir saat ini.</p>
          
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Uang Fisik di Laci</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">Rp</span>
                <InputNumber
                  className="w-full h-12 rounded-xl text-lg font-black pl-10 pt-1 border-warning/20 bg-warning/5"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  value={finalCashInput}
                  onChange={(val) => setFinalCashInput(val || 0)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="p-4 bg-secondary/20 rounded-2xl border border-border/10 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Modal Awal:</span>
                <span>{formatCurrency(activeShift?.initialCash || 0)}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span>Total Penjualan Tunai:</span>
                <span>{formatCurrency(JSON.parse(localStorage.getItem('teratur_today_sales') || '0'))}</span>
              </div>
              <div className="border-t border-border/20 pt-2 flex justify-between text-sm font-bold">
                <span>Ekspektasi Kasir:</span>
                <span>{formatCurrency((activeShift?.initialCash || 0) + JSON.parse(localStorage.getItem('teratur_today_sales') || '0'))}</span>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-2xl font-black text-sm bg-warning hover:bg-warning/90 text-white shadow-lg shadow-warning/20"
              onClick={handleEndShift}
            >
              AKHIRI & TUTUP KAS
            </Button>
          </div>
        </div>
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal
        title={null}
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        centered
        width={400}
        className="payment-modal"
      >
        <div className="pt-2">
          <div className="text-center mb-6">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Tagihan</h2>
            <p className="text-3xl font-black text-primary">{formatCurrency(total)}</p>
          </div>

          <div className="flex p-1 bg-secondary/30 rounded-2xl border border-border/30 mb-6">
            <button 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${paymentMethod === 'cash' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground'}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <Banknote className="w-4 h-4" /> Tunai
            </button>
            <button 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${paymentMethod === 'qris' ? 'bg-background shadow-md text-primary' : 'text-muted-foreground'}`}
              onClick={() => setPaymentMethod('qris')}
            >
              <QrCode className="w-4 h-4" /> QRIS
            </button>
          </div>

          {paymentMethod === 'cash' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Uang Diterima</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">Rp</span>
                  <InputNumber
                    className="w-full h-12 rounded-xl text-lg font-black pl-10 pt-1 border-primary/20 bg-primary/5"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    value={receivedAmount}
                    onChange={(val) => setReceivedAmount(val || 0)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9 font-bold text-[10px]" onClick={() => setReceivedAmount(total)}>UANG PAS</Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9 font-bold text-[10px]" onClick={() => setReceivedAmount(50000)}>50,000</Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9 font-bold text-[10px]" onClick={() => setReceivedAmount(100000)}>100,000</Button>
              </div>

              <div className="p-4 bg-secondary/20 rounded-2xl border border-border/10 flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase">Kembalian</span>
                <span className={`text-xl font-black ${receivedAmount - total < 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatCurrency(Math.max(0, receivedAmount - total))}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="w-48 h-48 bg-white p-2 rounded-2xl border-4 border-primary/20">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" 
                  alt="QRIS" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center text-[10px] text-muted-foreground font-medium max-w-[200px]">
                Silakan scan QRIS di atas. Pastikan status pembayaran Berhasil di aplikasi merchant Anda.
              </p>
            </div>
          )}

          <Button 
            className="w-full h-12 rounded-2xl mt-8 font-black text-sm shadow-lg shadow-primary/20"
            onClick={handleFinalPayment}
          >
            KONFIRMASI PEMBAYARAN
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Transactions;
