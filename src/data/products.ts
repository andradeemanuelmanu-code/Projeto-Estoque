export type Product = {
  id: string;
  code: string;
  description: string;
  category: string;
  brand: string;
  stock: number;
  minStock: number;
  maxStock: number;
};

export const mockProducts: Product[] = [];