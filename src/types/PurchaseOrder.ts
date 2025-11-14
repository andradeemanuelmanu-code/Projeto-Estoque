export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  date: string; // ISO date string
  totalValue: number;
  status: 'Pendente' | 'Recebido' | 'Cancelado';
  items: PurchaseOrderItem[];
}