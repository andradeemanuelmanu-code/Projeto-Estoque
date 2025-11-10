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
  { id: 'po_1', number: 'PC-2025-001', supplierId: 'sup_1', supplierName: 'Distribuidora Autopeças Brasil', date: '2025-06-05', status: 'Recebido', items: [ { productId: 'prod_1', productName: 'Vela de Ignição Laser Iridium', quantity: 50, unitPrice: 45.50 }, { productId: 'prod_2', productName: 'Pastilha de Freio Dianteira', quantity: 30, unitPrice: 80.00 }, { productId: 'prod_3', productName: 'Filtro de Óleo do Motor', quantity: 100, unitPrice: 15.00 } ], totalValue: 6175 },
  { id: 'po_2', number: 'PC-2025-002', supplierId: 'sup_2', supplierName: 'Fornecedora Minas Parts', date: '2025-06-10', status: 'Recebido', items: [ { productId: 'prod_4', productName: 'Amortecedor Dianteiro', quantity: 20, unitPrice: 250.00 }, { productId: 'prod_5', productName: 'Bateria Automotiva 60Ah', quantity: 15, unitPrice: 350.00 }, { productId: 'prod_6', productName: 'Kit Correia Dentada', quantity: 25, unitPrice: 180.00 } ], totalValue: 14750 },
  { id: 'po_3', number: 'PC-2025-003', supplierId: 'sup_3', supplierName: 'SP Peças Automotivas', date: '2025-07-02', status: 'Recebido', items: [ { productId: 'prod_7', productName: 'Óleo de Motor 5W30 Sintético 1L', quantity: 200, unitPrice: 38.00 }, { productId: 'prod_8', productName: 'Lâmpada Super Branca H4', quantity: 50, unitPrice: 25.00 } ], totalValue: 8850 },
  { id: 'po_4', number: 'PC-2025-004', supplierId: 'sup_1', supplierName: 'Distribuidora Autopeças Brasil', date: '2025-08-15', status: 'Recebido', items: [ { productId: 'prod_9', productName: 'Pneu 195/65R15', quantity: 40, unitPrice: 320.00 }, { productId: 'prod_10', productName: 'Disco de Freio Ventilado', quantity: 30, unitPrice: 120.00 } ], totalValue: 16400 },
  { id: 'po_5', number: 'PC-2025-005', supplierId: 'sup_2', supplierName: 'Fornecedora Minas Parts', date: '2025-08-20', status: 'Recebido', items: [ { productId: 'prod_1', productName: 'Vela de Ignição Laser Iridium', quantity: 30, unitPrice: 46.00 }, { productId: 'prod_2', productName: 'Pastilha de Freio Dianteira', quantity: 20, unitPrice: 82.00 } ], totalValue: 3020 },
  { id: 'po_6', number: 'PC-2025-006', supplierId: 'sup_3', supplierName: 'SP Peças Automotivas', date: '2025-09-05', status: 'Recebido', items: [ { productId: 'prod_5', productName: 'Bateria Automotiva 60Ah', quantity: 15, unitPrice: 355.00 }, { productId: 'prod_6', productName: 'Kit Correia Dentada', quantity: 20, unitPrice: 185.00 } ], totalValue: 9025 },
  { id: 'po_7', number: 'PC-2025-007', supplierId: 'sup_1', supplierName: 'Distribuidora Autopeças Brasil', date: '2025-10-10', status: 'Recebido', items: [ { productId: 'prod_3', productName: 'Filtro de Óleo do Motor', quantity: 100, unitPrice: 15.50 }, { productId: 'prod_7', productName: 'Óleo de Motor 5W30 Sintético 1L', quantity: 150, unitPrice: 39.00 } ], totalValue: 7400 },
  { id: 'po_8', number: 'PC-2025-008', supplierId: 'sup_2', supplierName: 'Fornecedora Minas Parts', date: '2025-11-01', status: 'Pendente', items: [ { productId: 'prod_4', productName: 'Amortecedor Dianteiro', quantity: 20, unitPrice: 255.00 }, { productId: 'prod_10', productName: 'Disco de Freio Ventilado', quantity: 10, unitPrice: 125.00 } ], totalValue: 6350 },
];