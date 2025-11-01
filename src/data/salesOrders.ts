import { mockCustomers } from './customers';
import { mockProducts } from './products';

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
  { 
    id: 'so_001', 
    number: 'PV-2024-001', 
    customerId: 'cust_001', 
    customerName: mockCustomers[0].name, 
    date: '2024-07-15', 
    totalValue: 753.8, 
    status: 'Faturado', 
    items: [
      { productId: 'prod_001', productName: mockProducts[0].description, quantity: 10, unitPrice: 49.90 },
      { productId: 'prod_002', productName: mockProducts[1].description, quantity: 5, unitPrice: 25.00 },
      { productId: 'prod_004', productName: mockProducts[3].description, quantity: 1, unitPrice: 129.80 },
    ] 
  },
  { 
    id: 'so_002', 
    number: 'PV-2024-002', 
    customerId: 'cust_002', 
    customerName: mockCustomers[1].name, 
    date: '2024-07-22', 
    totalValue: 1299.00, 
    status: 'Pendente', 
    items: [
      { productId: 'prod_003', productName: mockProducts[2].description, quantity: 2, unitPrice: 350.00 },
      { productId: 'prod_005', productName: mockProducts[4].description, quantity: 1, unitPrice: 599.00 },
    ] 
  },
  { 
    id: 'so_003', 
    number: 'PV-2024-003', 
    customerId: 'cust_003', 
    customerName: mockCustomers[2].name, 
    date: '2024-07-28', 
    totalValue: 315.00, 
    status: 'Cancelado', 
    items: [
      { productId: 'prod_006', productName: mockProducts[5].description, quantity: 2, unitPrice: 95.00 },
      { productId: 'prod_002', productName: mockProducts[1].description, quantity: 5, unitPrice: 25.00 },
    ] 
  },
  { 
    id: 'so_004', 
    number: 'PV-2024-004', 
    customerId: 'cust_001', 
    customerName: mockCustomers[0].name, 
    date: '2024-07-29', 
    totalValue: 1049.00, 
    status: 'Faturado', 
    items: [
      { productId: 'prod_007', productName: mockProducts[6].description, quantity: 1, unitPrice: 450.00 },
      { productId: 'prod_005', productName: mockProducts[4].description, quantity: 1, unitPrice: 599.00 },
    ] 
  },
];