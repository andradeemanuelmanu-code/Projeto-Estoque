import { useMemo } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { DateRange } from 'react-day-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface IdleStockTableProps {
  dateRange?: DateRange;
}

export const IdleStockTable = ({ dateRange }: IdleStockTableProps) => {
  const { products, salesOrders } = useAppData();

  const idleProducts = useMemo(() => {
    const filteredOrders = salesOrders.filter(order => {
      if (order.status !== 'Faturado') return false;
      if (!dateRange?.from) return true;
      const orderDate = new Date(order.date);
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 86400000) : new Date();
      return orderDate >= dateRange.from && orderDate < toDate;
    });

    const soldProductIds = new Set<string>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => soldProductIds.add(item.productId));
    });

    return products.filter(product => !soldProductIds.has(product.id) && product.stock > 0);
  }, [products, salesOrders, dateRange]);

  if (idleProducts.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        Nenhum produto parado encontrado no período.
      </div>
    );
  }

  return (
    <div className="h-[350px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Estoque Atual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {idleProducts.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.description}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};