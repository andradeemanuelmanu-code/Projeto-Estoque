import { useMemo } from "react";
import { DollarSign } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";

interface TotalRevenueCardProps {
  dateRange?: DateRange;
}

export const TotalRevenueCard = ({ dateRange }: TotalRevenueCardProps) => {
  const { salesOrders } = useAppData();
  const totalRevenue = useMemo(() => {
    const filteredOrders = salesOrders.filter(order => {
      if (order.status !== 'Faturado') return false;
      if (!dateRange?.from) return true;
      const orderDate = new Date(order.date);
      // Adiciona um dia ao 'to' para incluir o dia inteiro na comparação
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 86400000) : new Date();
      return orderDate >= dateRange.from && orderDate < toDate;
    });

    return filteredOrders.reduce((acc, order) => acc + order.totalValue, 0);
  }, [salesOrders, dateRange]);

  const formattedTotalRevenue = totalRevenue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Faturamento Total
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formattedTotalRevenue}
        </div>
        <p className="text-xs text-muted-foreground">
          Soma dos pedidos faturados no período.
        </p>
      </CardContent>
    </Card>
  );
};