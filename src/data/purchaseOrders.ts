import { mockSuppliers } from './suppliers';
import { mockProducts } from './products';

export type PurchaseOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type PurchaseOrder = {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  date: string;
  totalValue: number;
  status: "Pendente" | "Recebido" | "Cancelado";
  items: PurchaseOrderItem[];
};

export const mockPurchaseOrders: PurchaseOrder[] = [
  { 
    id: 'po_001', 
    number: 'PC-2024-001', 
    supplierId: 'sup_001', 
    supplierName: mockSuppliers[0].name, 
    date: '2024-07-18', 
    totalValue: 1050.00, 
    status: 'Recebido', 
    items: [
      { productId: 'prod_001', productName: mockProducts[0].description, quantity: 20, unitPrice: 25.50 },
      { productId: 'prod_003', productName: mockProducts[2].description, quantity: 3, unitPrice: 180.00 },
    ] 
  },
  { 
    id: 'po_002', 
    number: 'PC-2024-002', 
    supplierId: 'sup_002', 
    supplierName: mockSuppliers[1].name, 
    date: '2024-07-25', 
    totalValue: 860.00, 
    status: 'Pendente', 
    items: [
      { productId: 'prod_002', productName: mockProducts[1].description, quantity: 50, unitPrice: 12.00 },
      { productId: 'prod_004', productName: mockProducts[3].description, quantity: 4, unitPrice: 65.00 },
    ] 
  },
  { 
    id: 'po_003', 
    number: 'PC-2024-003', 
    supplierId: 'sup_001', 
    supplierName: mockSuppliers[0].name, 
    date: '2024-07-30', 
    totalValue: 225.00, 
    status: 'Cancelado', 
    items: [
      { productId: 'prod_006', productName: mockProducts[5].description, quantity: 5, unitPrice: 45.00 },
    ] 
  },
];