export interface Ingredient {
  id: string;
  name: string;
  unit: string; // gr, ml, pcs, etc
  stock: number;
  minStock: number;
  avgCost: number; // HPP per unit
  pricePerUnit: number; // For compatibility with Expenses
  category: string;
  description?: string;
  stockCurrent: number;
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

export const ingredients: Ingredient[] = [];

export const rawMaterials = ingredients;

export const products: Product[] = [];

export const kpiData = {
  totalRevenue: 0,
  totalHpp: 0,
  grossMargin: 0,
  totalTransactions: 0,
  totalExpenseOperasional: 0
};

export const dailyData: any[] = [];

export const costComposition: any[] = [];

export const hppBreakdown: any[] = [];

export const topProducts: any[] = [];

export const recentActivity: any[] = [];

export const transactions = recentActivity;

export const members: any[] = [];

export const employees: any[] = [];

export const businessData: BusinessData = {
  name: '',
  owner: '',
  type: '',
  address: '',
  phone: '',
  email: '',
  receiptHeader: '',
  receiptFooter: '',
  paperSize: '58mm',
};

