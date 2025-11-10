export type SalesOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type SalesOrder = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  totalValue: number;
  status: "Pendente" | "Faturado" | "Cancelado";
  items: SalesOrderItem[];
};

export const mockSalesOrders: SalesOrder[] = [];