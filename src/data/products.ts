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
  { id: 'prod_1', code: 'NGK-BKR6E', description: 'Vela de Ignição Laser Iridium', category: 'Motor', brand: 'NGK', stock: 66, minStock: 20, maxStock: 100 },
  { id: 'prod_2', code: 'CBQ-N1414', description: 'Pastilha de Freio Dianteira', category: 'Freios', brand: 'Cobreq', stock: 38, minStock: 15, maxStock: 80 },
  { id: 'prod_3', code: 'FRM-PH6017A', description: 'Filtro de Óleo do Motor', category: 'Filtros', brand: 'Fram', stock: 160, minStock: 50, maxStock: 250 },
  { id: 'prod_4', code: 'MNR-SP054', description: 'Amortecedor Dianteiro', category: 'Suspensão', brand: 'Monroe', stock: 12, minStock: 10, maxStock: 40 },
  { id: 'prod_5', code: 'MRA-M60AD', description: 'Bateria Automotiva 60Ah', category: 'Elétrica', brand: 'Moura', stock: 27, minStock: 10, maxStock: 50 },
  { id: 'prod_6', code: 'GTS-KS304', description: 'Kit Correia Dentada', category: 'Motor', brand: 'Gates', stock: 39, minStock: 15, maxStock: 60 },
  { id: 'prod_7', code: 'MBL-5W30', description: 'Óleo de Motor 5W30 Sintético 1L', category: 'Lubrificantes', brand: 'Mobil', stock: 290, minStock: 100, maxStock: 500 },
  { id: 'prod_8', code: 'OSR-H4-SB', description: 'Lâmpada Super Branca H4', category: 'Iluminação', brand: 'Osram', stock: 48, minStock: 30, maxStock: 100 },
  { id: 'prod_9', code: 'PIR-P1-195', description: 'Pneu 195/65R15', category: 'Pneus', brand: 'Pirelli', stock: 28, minStock: 16, maxStock: 50 },
  { id: 'prod_10', code: 'FMX-BD4752', description: 'Disco de Freio Ventilado', category: 'Freios', brand: 'Fremax', stock: 18, minStock: 10, maxStock: 40 },
];