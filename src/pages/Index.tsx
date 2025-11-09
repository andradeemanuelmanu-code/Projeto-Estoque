import { useState, useMemo } from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { StockAlertsCard } from "@/components/dashboard/StockAlertsCard";
import { TopProductsCard } from "@/components/dashboard/TopProductsCard";
import { MarginChartCard } from "@/components/dashboard/MarginChartCard";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";
import { useAppData } from "@/context/AppDataContext";
import { InventoryValueCard } from "@/components/relatorios/InventoryValueCard";

const Index = () => {
  const [period, setPeriod] = useState('month');
  const { salesOrders } = useAppData();

  const itemsSold = useMemo(() => {
    return salesOrders
      .filter(order => order.status === 'Faturado')
      .reduce((acc, order) => {
        return acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
      }, 0);
  }, [salesOrders]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Este Mês
          </Button>
          <Button
            variant={period === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('year')}
          >
            Este Ano
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <InventoryValueCard />
        <KpiCard
          title="Itens Vendidos"
          value={itemsSold.toString()}
          change="-2.4% da última hora"
          changeType="negative"
          Icon={Activity}
        />
        <StockAlertsCard />
        <MarginChartCard />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Status dos Pedidos de Venda</CardTitle>
            <CardDescription>Distribuição dos pedidos por status este mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderStatusChart />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <TopProductsCard />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Movimentação de Estoque</CardTitle>
          <CardDescription>Entradas e saídas de unidades de produtos.</CardDescription>
        </CardHeader>
        <CardContent>
          <StockMovementChart />
        </CardContent>
      </Card>
    </>
  );
};

export default Index;