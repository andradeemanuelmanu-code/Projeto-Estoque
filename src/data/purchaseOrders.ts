import { mockSuppliers } from './suppliers';

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
  { id: 'po_001', number: 'PC-2024-001', supplierId: 'sup_001', supplierName: mockSuppliers[0].name, date: '2024-07-28', totalValue: 1250.50, status: 'Recebido', items: [] },
  { id: 'po_002', number: 'PC-2024-002', supplierId: 'sup_002', supplierName: mockSuppliers[1].name, date: '2024-07-29', totalValue: 899.00, status: 'Pendente', items: [] },
  { id: 'po_003', number: 'PC-2024-003', supplierId: 'sup_001', supplierName: mockSuppliers[0].name, date: '2024-07-30', totalValue: 345.00, status: 'Cancelado', items: [] },
];