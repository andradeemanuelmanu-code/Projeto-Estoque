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

export const mockPurchaseOrders: PurchaseOrder[] = [];