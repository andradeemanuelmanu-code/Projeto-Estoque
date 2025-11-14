import { useMemo } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { DateRange } from 'react-day-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProfitabilityByProductTableProps {
  dateRange?: DateRange;
}

export const ProfitabilityByProductTable = ({ dateRange }: ProfitabilityByProductTableProps) => {
  const { products, salesOrders, purchaseOrders } = useAppData();

  const profitabilityData = useMemo(() => {
    const avgCosts = new Map<string, number>();
    const costData: { [productId: string]: { totalCost: number; totalQuantity: number } } = {};
    purchaseOrders.forEach(order => {
      if (order.status === 'Recebido') {
        order.items.forEach(item => {
          if (!costData[item.productId]) costData[item.productId] = { totalCost: 0, totalQuantity: 0 };
          costData[item.productId].totalCost += item.unitPrice * item.quantity;
          costData[item.productId].totalQuantity += item.quantity;
        });
      }
    });
    Object.keys(costData).forEach(productId => {
      const { totalCost, totalQuantity } = costData[productId];
      if (totalQuantity > 0) avgCosts.set(productId, totalCost / totalQuantity);
    });

    const filteredSalesOrders = salesOrders.filter(order => {
      if (order.status !== 'Faturado') return false;
      if (!dateRange?.from) return true;
      const orderDate = new Date(order.date);
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 86400000) : new Date();
      return orderDate >= dateRange.from && orderDate < toDate;
    });

    const profitData: { [productId: string]: { name: string; revenue: number; cost: number; } } = {};
    filteredSalesOrders.forEach(order => {
      order.items.forEach(item => {
        if (!profitData[item.productId]) {
          profitData[item.productId] = { name: item.productName, revenue: 0, cost: 0 };
        }
        const avgCost = avgCosts.get(item.productId) || 0;
        profitData[item.productId].revenue += item.quantity * item.unitPrice;
        profitData[item.productId].cost += item.quantity * avgCost;
      });
    });

    return Object.values(profitData)
      .map(data => {
        const profit = data.revenue - data.cost;
        const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0;
        return { ...data, profit, margin };
      })
      .sort((a, b) => b.profit - a.profit);
  }, [products, salesOrders, purchaseOrders, dateRange]);

  if (profitabilityData.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        Não há dados de lucratividade para exibir.
      </div>
    );
  }

  return (
    <div className="h-[350px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Lucro Bruto</TableHead>
            <TableHead className="text-right">Margem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profitabilityData.map(item => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">{item.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
              <TableCell className="text-right">{item.margin.toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};