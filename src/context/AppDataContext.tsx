import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
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
  updateSalesOrderStatus: (orderId: string, newStatus: SalesOrder['status']) => void;
  updatePurchaseOrderStatus: (orderId: string, newStatus: PurchaseOrder['status']) => void;
  markNotificationsAsRead: () => void;
  markSingleNotificationAsRead: (notificationId: string) => void;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const loadNotificationsFromStorage = (): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem('autoparts_notifications');
    if (storedNotifications) {
      // Garante que as datas sejam objetos Date
      return JSON.parse(storedNotifications).map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      }));
    }
  } catch (error) {
    console.error("Failed to load notifications from localStorage", error);
  }
  return [];
};

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [notifications, setNotifications] = useState<Notification[]>(loadNotificationsFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem('autoparts_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error("Failed to save notifications to localStorage", error);
    }
  }, [notifications]);

  const addNotification = (message: string, linkTo?: string) => {
    const alertsEnabled = localStorage.getItem('user_settings_enableStockAlerts') !== 'false';
    if (!alertsEnabled) return;

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

  const markSingleNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
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

  const updateSalesOrderStatus = (orderId: string, newStatus: SalesOrder['status']) => {
    let orderToUpdate: SalesOrder | undefined;
    let originalStatus: SalesOrder['status'] | undefined;

    setSalesOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          if (order.status === newStatus) return order;
          originalStatus = order.status;
          orderToUpdate = { ...order, status: newStatus };
          return orderToUpdate;
        }
        return order;
      })
    );

    if (orderToUpdate && originalStatus) {
      const wasFaturado = originalStatus === 'Faturado';
      const isFaturado = newStatus === 'Faturado';

      if (wasFaturado && !isFaturado) {
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          orderToUpdate!.items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
            if (productIndex !== -1) updatedProducts[productIndex].stock += item.quantity;
          });
          return updatedProducts;
        });
      } else if (!wasFaturado && isFaturado) {
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          orderToUpdate!.items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
            if (productIndex !== -1) updatedProducts[productIndex].stock -= item.quantity;
          });
          return updatedProducts;
        });
      }
      addNotification(`Status do pedido ${orderToUpdate.number} atualizado para ${newStatus}.`, `/vendas/pedidos/${orderId}`);
    }
  };

  const updatePurchaseOrderStatus = (orderId: string, newStatus: PurchaseOrder['status']) => {
    let orderToUpdate: PurchaseOrder | undefined;
    let originalStatus: PurchaseOrder['status'] | undefined;

    setPurchaseOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          if (order.status === newStatus) return order;
          originalStatus = order.status;
          orderToUpdate = { ...order, status: newStatus };
          return orderToUpdate;
        }
        return order;
      })
    );

    if (orderToUpdate && originalStatus) {
      const wasRecebido = originalStatus === 'Recebido';
      const isRecebido = newStatus === 'Recebido';

      if (wasRecebido && !isRecebido) {
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          orderToUpdate!.items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
            if (productIndex !== -1) updatedProducts[productIndex].stock -= item.quantity;
          });
          return updatedProducts;
        });
      } else if (!wasRecebido && isRecebido) {
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          orderToUpdate!.items.forEach(item => {
            const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
            if (productIndex !== -1) updatedProducts[productIndex].stock += item.quantity;
          });
          return updatedProducts;
        });
      }
      addNotification(`Status do pedido de compra ${orderToUpdate.number} atualizado para ${newStatus}.`, `/compras/pedidos/${orderId}`);
    }
  };

  const cancelSalesOrder = (orderId: string) => {
    const order = salesOrders.find(o => o.id === orderId);
    if (order && order.status !== 'Cancelado') {
      updateSalesOrderStatus(orderId, 'Cancelado');
    }
  };

  const cancelPurchaseOrder = (orderId: string) => {
    const order = purchaseOrders.find(o => o.id === orderId);
    if (order && order.status !== 'Cancelado') {
      updatePurchaseOrderStatus(orderId, 'Cancelado');
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
    updateSalesOrderStatus,
    updatePurchaseOrderStatus,
    markNotificationsAsRead,
    markSingleNotificationAsRead,
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