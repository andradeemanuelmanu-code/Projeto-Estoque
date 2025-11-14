import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from 'date-fns';
import { SalesOrder } from '@/types/SalesOrder';
import { PurchaseOrder } from '@/types/PurchaseOrder';
import { DollarSign, Activity } from 'lucide-react';

const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }
  const change = ((current - previous) / previous) * 100;
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
};

interface UseDashboardMetricsProps {
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  period: 'month' | 'year';
}

export const useDashboardMetrics = ({ salesOrders, purchaseOrders, period }: UseDashboardMetricsProps) => {
  const { currentRange, previousRange } = useMemo(() => {
    const now = new Date();
    if (period === 'month') {
      return {
        currentRange: { start: startOfMonth(now), end: endOfMonth(now) },
        previousRange: { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) }
      };
    }
    return {
      currentRange: { start: startOfYear(now), end: endOfYear(now) },
      previousRange: { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) }
    };
  }, [period]);

  const filteredSalesOrders = useMemo(() => {
    return salesOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= currentRange.start && orderDate <= currentRange.end;
    });
  }, [salesOrders, currentRange]);

  const filteredPurchaseOrders = useMemo(() => {
    return purchaseOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= currentRange.start && orderDate <= currentRange.end;
    });
  }, [purchaseOrders, currentRange]);

  const { revenueKpi, soldItemsKpi, marginKpi } = useMemo(() => {
    const periodLabel = period === 'month' ? 'do último mês' : 'do último ano';

    const getMetrics = (orders: SalesOrder[]) => {
      const faturadoOrders = orders.filter(o => o.status === 'Faturado');
      const revenue = faturadoOrders.reduce((sum, o) => sum + o.totalValue, 0);
      const itemsSold = faturadoOrders.reduce((sum, o) => sum + o.items.reduce((itemSum, i) => itemSum + i.quantity, 0), 0);
      return { revenue, itemsSold };
    };

    const previousSalesOrders = salesOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= previousRange.start && orderDate <= previousRange.end;
    });

    const currentMetrics = getMetrics(filteredSalesOrders);
    const previousMetrics = getMetrics(previousSalesOrders);

    const revenueChange = calculatePercentageChange(currentMetrics.revenue, previousMetrics.revenue);
    const itemsSoldChange = calculatePercentageChange(currentMetrics.itemsSold, previousMetrics.itemsSold);

    return {
      revenueKpi: {
        title: "Faturamento Total",
        value: currentMetrics.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        change: `${revenueChange} ${periodLabel}`,
        changeType: (currentMetrics.revenue >= previousMetrics.revenue ? "positive" : "negative") as "positive" | "negative",
        Icon: DollarSign,
      },
      soldItemsKpi: {
        title: "Itens Vendidos",
        value: currentMetrics.itemsSold.toString(),
        change: `${itemsSoldChange} ${periodLabel}`,
        changeType: (currentMetrics.itemsSold >= previousMetrics.itemsSold ? "positive" : "negative") as "positive" | "negative",
        Icon: Activity,
      },
      marginKpi: { // Simplificado por enquanto
        value: "42.5%",
        change: `+2.1% ${periodLabel}`,
      }
    };
  }, [filteredSalesOrders, salesOrders, previousRange, period]);

  return {
    revenueKpi,
    soldItemsKpi,
    marginKpi,
    filteredSalesOrders,
    filteredPurchaseOrders,
  };
};