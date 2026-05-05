export interface Ingredient {
  id: string;
  name: string;
  unit: string; // gr, ml, pcs, etc
  stock: number;
  minStock: number;
  avgCost: number; // HPP per unit
  category: string;
}

export interface RawMaterial extends Ingredient {} // Compatibility with old type

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  hpp: number;
  margin: number;
  emoji: string;
  recipe: RecipeItem[];
  ingredients: Ingredient[];
  laborCost: number;
  overheadCost: number;
  salesCount: number;
  trend?: number;
  unit: string;
  description?: string;
  stockInitial?: number;
  stockCurrent?: number;
}

export interface BusinessData {
  name: string;
  owner: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  initialCapital?: number;
  capitalSource?: string;
  foundingDate?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  paperSize?: '58mm' | '80mm';
}

export const ingredients: Ingredient[] = [
  { id: 'ing-1', name: 'Biji Kopi Arabika', unit: 'gr', stock: 5000, minStock: 1000, avgCost: 250, category: 'Kopi' },
  { id: 'ing-2', name: 'Susu UHT', unit: 'ml', stock: 10000, minStock: 2000, avgCost: 18, category: 'Susu' },
  { id: 'ing-3', name: 'Sirup Caramel', unit: 'ml', stock: 2000, minStock: 500, avgCost: 50, category: 'Sirup' },
  { id: 'ing-4', name: 'Cup 12oz', unit: 'pcs', stock: 200, minStock: 50, avgCost: 800, category: 'Packaging' },
];

export const rawMaterials = ingredients;

export const products: Product[] = [
  { 
    id: 'p-1', 
    name: 'Espresso', 
    category: 'Coffee', 
    sellingPrice: 20000, 
    hpp: 5300,
    margin: 65.5,
    emoji: '☕',
    recipe: [{ ingredientId: 'ing-1', quantity: 18 }, { ingredientId: 'ing-4', quantity: 1 }],
    ingredients: [
      { id: 'ing-1', name: 'Biji Kopi Arabika', amount: 18, unit: 'gr', pricePerUnit: 250, totalCost: 4500, category: 'raw' } as any,
      { id: 'ing-4', name: 'Cup 12oz', amount: 1, unit: 'pcs', pricePerUnit: 800, totalCost: 800, category: 'raw' } as any
    ],
    laborCost: 1000,
    overheadCost: 500,
    salesCount: 385,
    unit: 'Cup',
    trend: 8.2
  },
  { 
    id: 'p-2', 
    name: 'Caramel Latte', 
    category: 'Coffee', 
    sellingPrice: 35000, 
    hpp: 9800,
    margin: 72.3,
    emoji: '🍯',
    recipe: [{ ingredientId: 'ing-1', quantity: 18 }, { ingredientId: 'ing-2', quantity: 200 }, { ingredientId: 'ing-3', quantity: 20 }, { ingredientId: 'ing-4', quantity: 1 }],
    ingredients: [
      { id: 'ing-1', name: 'Biji Kopi Arabika', amount: 18, unit: 'gr', pricePerUnit: 250, totalCost: 4500, category: 'raw' } as any,
      { id: 'ing-2', name: 'Susu UHT', amount: 200, unit: 'ml', pricePerUnit: 18, totalCost: 3600, category: 'raw' } as any,
      { id: 'ing-3', name: 'Sirup Caramel', amount: 20, unit: 'ml', pricePerUnit: 50, totalCost: 1000, category: 'raw' } as any,
      { id: 'ing-4', name: 'Cup 12oz', amount: 1, unit: 'pcs', pricePerUnit: 800, totalCost: 800, category: 'raw' } as any
    ],
    laborCost: 1500,
    overheadCost: 1000,
    salesCount: 452,
    unit: 'Cup',
    trend: 12.5
  },
  { 
    id: 'p-3', 
    name: 'Croissant', 
    category: 'Bakery', 
    sellingPrice: 25000, 
    hpp: 11000,
    margin: 55.0,
    emoji: '🥐',
    recipe: [],
    ingredients: [],
    laborCost: 2000,
    overheadCost: 2000,
    salesCount: 245,
    unit: 'Pcs',
    trend: -3.1
  },
  { 
    id: 'p-4', 
    name: 'Iced Americano', 
    category: 'Coffee', 
    sellingPrice: 22000, 
    hpp: 6500,
    margin: 68.4,
    emoji: '🧊',
    recipe: [{ ingredientId: 'ing-1', quantity: 18 }],
    ingredients: [
      { id: 'ing-1', name: 'Biji Kopi Arabika', amount: 18, unit: 'gr', pricePerUnit: 250, totalCost: 4500, category: 'raw' } as any
    ],
    laborCost: 1000,
    overheadCost: 1000,
    salesCount: 210,
    unit: 'Cup',
    trend: 5.4
  }
];

export const kpiData = {
  totalRevenue: 125400000,
  totalHpp: 45200000,
  grossMargin: 64,
  totalTransactions: 1240
};

export const dailyData = [
  { day: 'Sen', revenue: 4200000, hpp: 1500000, profit: 2700000 },
  { day: 'Sel', revenue: 3800000, hpp: 1400000, profit: 2400000 },
  { day: 'Rab', revenue: 5100000, hpp: 1800000, profit: 3300000 },
  { day: 'Kam', revenue: 4600000, hpp: 1600000, profit: 3000000 },
  { day: 'Jum', revenue: 6200000, hpp: 2100000, profit: 4100000 },
  { day: 'Sab', revenue: 8500000, hpp: 2800000, profit: 5700000 },
  { day: 'Min', revenue: 7900000, hpp: 2600000, profit: 5300000 },
];

export const costComposition = [
  { name: 'Bahan Baku', value: 45200000, color: '#2F77B3' },
  { name: 'Gaji Karyawan', value: 15000000, color: '#7FBF5B' },
  { name: 'Sewa & Listrik', value: 8000000, color: '#F59E0B' },
  { name: 'Pemasaran', value: 2000000, color: '#EF4444' },
];

export const hppBreakdown = [
  { category: 'Bahan Baku', amount: 32000000, percentage: 70.8 },
  { category: 'Tenaga Kerja', amount: 8000000, percentage: 17.7 },
  { category: 'Overhead', amount: 5200000, percentage: 11.5 },
];

export const topProducts = [
  { name: 'Caramel Latte', sales: 452, trend: 12.5, image: '🍯' },
  { name: 'Espresso', sales: 385, trend: 8.2, image: '☕' },
  { name: 'Croissant', sales: 245, trend: -3.1, image: '🥐' },
  { name: 'Iced Americano', sales: 210, trend: 5.4, image: '🧊' },
];

export const recentActivity = [
  { id: 1, type: 'sale', title: 'Penjualan Baru', desc: 'Caramel Latte (2x)', time: '2 menit yang lalu', amount: 'Rp 70.000' },
  { id: 2, type: 'expense', title: 'Restock Bahan', desc: 'Biji Kopi Arabika 5kg', time: '15 menit yang lalu', amount: '-Rp 1.250.000' },
  { id: 3, type: 'system', title: 'Karyawan Absen', desc: 'Ahmad Barista (Check-in)', time: '1 jam yang lalu', amount: null },
];

export const transactions = recentActivity;

export const members: any[] = [
  { id: '1', name: 'Budi Santoso', phone: '08123456789', email: 'budi@gmail.com', points: 150, level: 'Silver', joinDate: '2024-01-10' },
  { id: '2', name: 'Siti Aminah', phone: '08571234567', email: 'siti@yahoo.com', points: 50, level: 'Bronze', joinDate: '2024-02-15' },
  { id: '3', name: 'Andi Wijaya', phone: '08119876543', email: 'andi@outlook.com', points: 450, level: 'Gold', joinDate: '2023-11-20' },
  { id: '4', name: 'Dewi Lestari', phone: '08122233344', email: 'dewi@gmail.com', points: 1000, level: 'Gold', joinDate: '2023-05-10' },
  { id: '5', name: 'Rian Hidayat', phone: '08987654321', email: 'rian@gmail.com', points: 25, level: 'Bronze', joinDate: '2025-01-05' },
];

export const employees: any[] = [
  { id: 'emp-1', name: 'Ahmad Barista', role: 'Barista', status: 'active', joinDate: '2023-01-01' },
  { id: 'emp-2', name: 'Siti Kasir', role: 'Cashier', status: 'active', joinDate: '2023-05-15' },
];

export const businessData: BusinessData = {
  name: 'Teratur Coffee & Eatery',
  owner: 'Budi Santoso',
  type: 'Coffee Shop',
  address: 'Jl. Sudirman No. 12, Jakarta',
  phone: '08123456789',
  email: 'hello@teratur.id',
  receiptHeader: 'Terima kasih telah berkunjung!',
  receiptFooter: 'Barang yang sudah dibeli tidak dapat ditukar',
  paperSize: '58mm',
};
