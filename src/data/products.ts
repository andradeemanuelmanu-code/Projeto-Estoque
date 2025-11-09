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

export const mockProducts: Product[] = [
  { id: 'prod_001', code: 'NGK-BKR6E', description: 'Vela de Ignição Laser Iridium', category: 'Ignição', brand: 'NGK', stock: 150, minStock: 50, maxStock: 300 },
  { id: 'prod_002', code: 'FR-7882', description: 'Filtro de Óleo do Motor', category: 'Filtros', brand: 'Fram', stock: 80, minStock: 30, maxStock: 200 },
  { id: 'prod_003', code: 'COF-GP30457', description: 'Amortecedor Dianteiro', category: 'Suspensão', brand: 'Cofap', stock: 45, minStock: 20, maxStock: 100 },
  { id: 'prod_004', code: 'BOS-0986', description: 'Pastilha de Freio Dianteira', category: 'Freios', brand: 'Bosch', stock: 15, minStock: 25, maxStock: 150 },
  { id: 'prod_005', code: 'VAL-507826', description: 'Kit de Embreagem', category: 'Transmissão', brand: 'Valeo', stock: 30, minStock: 10, maxStock: 50 },
  { id: 'prod_006', code: 'GAT-KS304', description: 'Correia Dentada', category: 'Motor', brand: 'Gates', stock: 120, minStock: 40, maxStock: 250 },
  { id: 'prod_007', code: 'MOU-M60AD', description: 'Bateria 60Ah', category: 'Elétrica', brand: 'Moura', stock: 60, minStock: 20, maxStock: 80 },
];