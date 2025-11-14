import { useMemo } from 'react';
import { Product } from '@/data/products';
import { SalesOrder } from '@/data/salesOrders';
import { PurchaseOrder } from '@/data/purchaseOrders';

interface UseProductHistoryProps {
  products: Product[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
}

export const useProductHistory = (productId: string | null, { products, salesOrders, purchaseOrders }: UseProductHistoryProps) => {
  return useMemo(() => {
    if (!productId) {
      return { product: null, movements: [] };
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      return { product: null, movements: [] };
    }

    const purchaseMovements = purchaseOrders
      .filter(order => order.status === 'Recebido')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Entrada' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'purchase' as const,
            quantity: item.quantity,
          }))
      );

    const salesMovements = salesOrders
      .filter(order => order.status === 'Faturado')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Saída' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'sales' as const,
            quantity: -item.quantity,
          }))
      );

    const allMovements = [...purchaseMovements, ...salesMovements].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const totalMovementQuantity = allMovements.reduce((acc, mov) => acc + mov.quantity, 0);
    const initialStock = product.stock - totalMovementQuantity;

    let balance = initialStock;
    const movementsWithBalance = allMovements.map(mov => {
      balance += mov.quantity;
      return { ...mov, balance };
    });

    return { product, movements: movementsWithBalance };
  }, [productId, products, salesOrders, purchaseOrders]);
};