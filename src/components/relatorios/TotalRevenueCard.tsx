import { useMemo } from "react";
import { DollarSign } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TotalRevenueCard = () => {
  const { salesOrders } = useAppData();
  const totalRevenue = useMemo(() => {
    return salesOrders
      .filter(order => order.status === 'Faturado')
      .reduce((acc, order) => acc + order.totalValue, 0);
  }, [salesOrders]);

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
          Soma de todos os pedidos de venda faturados.
        </p>
      </CardContent>
    </Card>
  );
};