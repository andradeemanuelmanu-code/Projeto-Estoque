export interface SalesOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string; // ISO date string
  totalValue: number;
  status: 'Pendente' | 'Faturado' | 'Cancelado';
  items: SalesOrderItem[];
}