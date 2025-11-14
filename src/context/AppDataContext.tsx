import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/Product';
import { SalesOrder } from '@/types/SalesOrder';
import { Customer } from '@/types/Customer';
import { Supplier } from '@/types/Supplier';
import { PurchaseOrder } from '@/types/PurchaseOrder';

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
  loading: boolean;
  addSalesOrder: (order: Omit<SalesOrder, 'id' | 'number'>) => Promise<void>;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'number'>) => Promise<void>;
  cancelSalesOrder: (orderId: string) => Promise<void>;
  cancelPurchaseOrder: (orderId: string) => Promise<void>;
  updateSalesOrderStatus: (orderId: string, newStatus: SalesOrder['status']) => Promise<void>;
  updatePurchaseOrderStatus: (orderId: string, newStatus: PurchaseOrder['status']) => Promise<void>;
  markNotificationsAsRead: () => void;
  markSingleNotificationAsRead: (notificationId: string) => void;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          { data: productsData, error: productsError },
          { data: salesOrdersData, error: salesOrdersError },
          { data: customersData, error: customersError },
          { data: suppliersData, error: suppliersError },
          { data: purchaseOrdersData, error: purchaseOrdersError },
        ] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('sales_orders').select('*'),
          supabase.from('customers').select('*'),
          supabase.from('suppliers').select('*'),
          supabase.from('purchase_orders').select('*'),
        ]);

        if (productsError) throw productsError;
        if (salesOrdersError) throw salesOrdersError;
        if (customersError) throw customersError;
        if (suppliersError) throw suppliersError;
        if (purchaseOrdersError) throw purchaseOrdersError;

        setProducts(productsData?.map((p: any) => ({
          ...p,
          minStock: p.min_stock,
          maxStock: p.max_stock,
        })) || []);
        
        setSalesOrders(salesOrdersData?.map((o: any) => ({
          ...o,
          customerId: o.customer_id,
          customerName: o.customer_name,
          totalValue: o.total_value,
        })) || []);

        setCustomers(customersData?.map((c: any) => ({
          ...c,
          cpfCnpj: c.cpf_cnpj,
        })) || []);

        setSuppliers(suppliersData || []);

        setPurchaseOrders(purchaseOrdersData?.map((o: any) => ({
          ...o,
          supplierId: o.supplier_id,
          supplierName: o.supplier_name,
          totalValue: o.total_value,
        })) || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const markNotificationsAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markSingleNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const addSalesOrder = async (orderData: any) => {
    // Implementation would go here
  };
  const addPurchaseOrder = async (orderData: any) => {
    // Implementation would go here
  };
  const updateSalesOrderStatus = async (orderId: string, newStatus: SalesOrder['status']) => {
    // Implementation would go here
  };
  const updatePurchaseOrderStatus = async (orderId: string, newStatus: PurchaseOrder['status']) => {
    // Implementation would go here
  };
  const cancelSalesOrder = async (orderId: string) => {
    // Implementation would go here
  };
  const cancelPurchaseOrder = async (orderId: string) => {
    // Implementation would go here
  };

  const value = useMemo(() => ({
    products, salesOrders, customers, suppliers, purchaseOrders, notifications, loading,
    addSalesOrder, addPurchaseOrder, cancelSalesOrder, cancelPurchaseOrder,
    updateSalesOrderStatus, updatePurchaseOrderStatus,
    markNotificationsAsRead, markSingleNotificationAsRead,
  }), [products, salesOrders, customers, suppliers, purchaseOrders, notifications, loading]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
};