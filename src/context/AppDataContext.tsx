import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockProducts, Product } from '@/data/products';
import { mockSalesOrders, SalesOrder } from '@/data/salesOrders';
import { mockCustomers, Customer } from '@/data/customers';
import { mockSuppliers, Supplier } from '@/data/suppliers';
import { mockPurchaseOrders, PurchaseOrder } from '@/data/purchaseOrders';

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: Date;
  linkTo?: string;
};

export interface AppDataContextType {
  products: Product[];
  salesOrders: SalesOrder[];
  customers: Customer[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  notifications: Notification[];
  addSalesOrder: (order: Omit<SalesOrder, 'id' | 'number'>) => void;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'number'>) => void;
  cancelSalesOrder: (orderId: string) => void;
  cancelPurchaseOrder: (orderId: string) => void;
  markNotificationsAsRead: () => void;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, linkTo?: string) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      message,
      read: false,
      createdAt: new Date(),
      linkTo,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addSalesOrder = (orderData: Omit<SalesOrder, 'id' | 'number'>) => {
    const newOrderNumber = `PV-2024-${(salesOrders.length + 1).toString().padStart(3, '0')}`;
    const newOrder: SalesOrder = { id: `so_${Date.now()}`, number: newOrderNumber, ...orderData };
    setSalesOrders(prevOrders => [newOrder, ...prevOrders]);

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      newOrder.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          const product = updatedProducts[productIndex];
          const oldStock = product.stock;
          const newStock = oldStock - item.quantity;
          updatedProducts[productIndex].stock = newStock;

          if (newStock <= product.minStock && oldStock > product.minStock) {
            addNotification(`Estoque baixo: ${product.description}`, '/estoque');
          }
        }
      });
      return updatedProducts;
    });
  };

  const addPurchaseOrder = (orderData: Omit<PurchaseOrder, 'id' | 'number'>) => {
    const newOrderNumber = `PC-2024-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`;
    const newOrder: PurchaseOrder = { id: `po_${Date.now()}`, number: newOrderNumber, ...orderData };
    setPurchaseOrders(prevOrders => [newOrder, ...prevOrders]);

    if (newOrder.status === 'Recebido') {
        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            newOrder.items.forEach(item => {
                const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
                if (productIndex !== -1) {
                    updatedProducts[productIndex].stock += item.quantity;
                }
            });
            return updatedProducts;
        });
    }
  };

  const cancelSalesOrder = (orderId: string) => {
    let orderToCancel: SalesOrder | undefined;

    setSalesOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId && order.status !== 'Cancelado') {
          orderToCancel = { ...order, status: 'Cancelado' };
          return orderToCancel;
        }
        return order;
      })
    );

    if (orderToCancel) {
      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts];
        (orderToCancel as SalesOrder).items.forEach(item => {
          const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
          if (productIndex !== -1) {
            updatedProducts[productIndex].stock += item.quantity;
          }
        });
        return updatedProducts;
      });
      addNotification(`Pedido ${orderToCancel.number} foi cancelado.`, '/vendas/pedidos');
    }
  };

  const cancelPurchaseOrder = (orderId: string) => {
    let orderToCancel: PurchaseOrder | undefined;
    let originalStatus: PurchaseOrder['status'] | undefined;

    setPurchaseOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId && order.status !== 'Cancelado') {
          originalStatus = order.status;
          orderToCancel = { ...order, status: 'Cancelado' };
          return orderToCancel;
        }
        return order;
      })
    );

    if (orderToCancel && originalStatus === 'Recebido') {
      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts];
        orderToCancel!.items.forEach(item => {
          const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
          if (productIndex !== -1) {
            updatedProducts[productIndex].stock -= item.quantity;
          }
        });
        return updatedProducts;
      });
      addNotification(`Pedido de compra ${orderToCancel.number} cancelado. Estoque revertido.`, '/compras/pedidos');
    } else if (orderToCancel) {
      addNotification(`Pedido de compra ${orderToCancel.number} foi cancelado.`, '/compras/pedidos');
    }
  };

  const value = useMemo(() => ({
    products,
    salesOrders,
    customers,
    suppliers,
    purchaseOrders,
    notifications,
    addSalesOrder,
    addPurchaseOrder,
    cancelSalesOrder,
    cancelPurchaseOrder,
    markNotificationsAsRead,
  }), [products, salesOrders, customers, suppliers, purchaseOrders, notifications]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};