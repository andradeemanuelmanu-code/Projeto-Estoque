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

export const mockSalesOrders: SalesOrder[] = [
  { id: 'so_1', number: 'PV-2025-001', customerId: 'cust_1', customerName: 'Oficina do Zé', date: '2025-06-20', status: 'Faturado', items: [ { productId: 'prod_1', productName: 'Vela de Ignição Laser Iridium', quantity: 10, unitPrice: 65.00 }, { productId: 'prod_2', productName: 'Pastilha de Freio Dianteira', quantity: 4, unitPrice: 120.00 } ], totalValue: 1130 },
  { id: 'so_2', number: 'PV-2025-002', customerId: 'cust_3', customerName: 'Carlos Silva', date: '2025-06-25', status: 'Faturado', items: [ { productId: 'prod_3', productName: 'Filtro de Óleo do Motor', quantity: 20, unitPrice: 25.00 } ], totalValue: 500 },
  { id: 'so_3', number: 'PV-2025-003', customerId: 'cust_2', customerName: 'Auto Center Veloz', date: '2025-07-15', status: 'Faturado', items: [ { productId: 'prod_4', productName: 'Amortecedor Dianteiro', quantity: 4, unitPrice: 350.00 }, { productId: 'prod_5', productName: 'Bateria Automotiva 60Ah', quantity: 1, unitPrice: 450.00 }, { productId: 'prod_6', productName: 'Kit Correia Dentada', quantity: 2, unitPrice: 280.00 } ], totalValue: 2410 },
  { id: 'so_4', number: 'PV-2025-004', customerId: 'cust_4', customerName: 'Mariana Costa', date: '2025-07-28', status: 'Faturado', items: [ { productId: 'prod_7', productName: 'Óleo de Motor 5W30 Sintético 1L', quantity: 10, unitPrice: 55.00 }, { productId: 'prod_8', productName: 'Lâmpada Super Branca H4', quantity: 2, unitPrice: 40.00 } ], totalValue: 630 },
  { id: 'so_5', number: 'PV-2025-005', customerId: 'cust_5', customerName: 'Frota de Veículos Ltda', date: '2025-08-18', status: 'Faturado', items: [ { productId: 'prod_9', productName: 'Pneu 195/65R15', quantity: 12, unitPrice: 420.00 }, { productId: 'prod_10', productName: 'Disco de Freio Ventilado', quantity: 8, unitPrice: 180.00 } ], totalValue: 6480 },
  { id: 'so_6', number: 'PV-2025-006', customerId: 'cust_1', customerName: 'Oficina do Zé', date: '2025-08-22', status: 'Cancelado', items: [ { productId: 'prod_1', productName: 'Vela de Ignição Laser Iridium', quantity: 5, unitPrice: 65.00 }, { productId: 'prod_3', productName: 'Filtro de Óleo do Motor', quantity: 10, unitPrice: 25.00 } ], totalValue: 575 },
  { id: 'so_7', number: 'PV-2025-007', customerId: 'cust_2', customerName: 'Auto Center Veloz', date: '2025-09-10', status: 'Faturado', items: [ { productId: 'prod_5', productName: 'Bateria Automotiva 60Ah', quantity: 2, unitPrice: 455.00 }, { productId: 'prod_6', productName: 'Kit Correia Dentada', quantity: 4, unitPrice: 285.00 } ], totalValue: 2050 },
  { id: 'so_8', number: 'PV-2025-008', customerId: 'cust_3', customerName: 'Carlos Silva', date: '2025-09-25', status: 'Faturado', items: [ { productId: 'prod_1', productName: 'Vela de Ignição Laser Iridium', quantity: 4, unitPrice: 68.00 } ], totalValue: 272 },
  { id: 'so_9', number: 'PV-2025-009', customerId: 'cust_5', customerName: 'Frota de Veículos Ltda', date: '2025-10-15', status: 'Faturado', items: [ { productId: 'prod_7', productName: 'Óleo de Motor 5W30 Sintético 1L', quantity: 50, unitPrice: 52.00 }, { productId: 'prod_3', productName: 'Filtro de Óleo do Motor', quantity: 20, unitPrice: 24.00 } ], totalValue: 3080 },
  { id: 'so_10', number: 'PV-2025-010', customerId: 'cust_1', customerName: 'Oficina do Zé', date: '2025-10-28', status: 'Faturado', items: [ { productId: 'prod_2', productName: 'Pastilha de Freio Dianteira', quantity: 8, unitPrice: 125.00 }, { productId: 'prod_10', productName: 'Disco de Freio Ventilado', quantity: 4, unitPrice: 185.00 } ], totalValue: 1740 },
  { id: 'so_11', number: 'PV-2025-011', customerId: 'cust_2', customerName: 'Auto Center Veloz', date: '2025-11-05', status: 'Faturado', items: [ { productId: 'prod_4', productName: 'Amortecedor Dianteiro', quantity: 4, unitPrice: 360.00 } ], totalValue: 1440 },
  { id: 'so_12', number: 'PV-2025-012', customerId: 'cust_4', customerName: 'Mariana Costa', date: '2025-11-10', status: 'Pendente', items: [ { productId: 'prod_8', productName: 'Lâmpada Super Branca H4', quantity: 2, unitPrice: 42.00 } ], totalValue: 84 },
];