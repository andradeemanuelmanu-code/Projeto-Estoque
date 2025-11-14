import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { StockAlertsCard } from "@/components/dashboard/StockAlertsCard";
import { TopProductsCard } from "@/components/dashboard/TopProductsCard";
import { MarginChartCard } from "@/components/dashboard/MarginChartCard";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";
import { useAppData } from "@/context/AppDataContext";
import { Product } from "@/data/products";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

const Index = () => {
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const { salesOrders, purchaseOrders, products } = useAppData();
  const [isLowStockAlertOpen, setIsLowStockAlertOpen] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const {
    revenueKpi,
    soldItemsKpi,
    marginKpi,
    filteredSalesOrders,
    filteredPurchaseOrders,
  } = useDashboardMetrics({ salesOrders, purchaseOrders, period });

  useEffect(() => {
    const currentLowStockProducts = products.filter(p => p.stock <= p.minStock);
    if (currentLowStockProducts.length === 0) return;

    const shownAlertsRaw = sessionStorage.getItem('shownLowStockProductIds');
    const shownProductIds: string[] = shownAlertsRaw ? JSON.parse(shownAlertsRaw) : [];

    const newProductsToShow = currentLowStockProducts.filter(
      p => !shownProductIds.includes(p.id)
    );

    if (newProductsToShow.length > 0) {
      setLowStockProducts(newProductsToShow);
      setIsLowStockAlertOpen(true);

      const newShownIds = newProductsToShow.map(p => p.id);
      const updatedShownIds = [...new Set([...shownProductIds, ...newShownIds])];
      sessionStorage.setItem('shownLowStockProductIds', JSON.stringify(updatedShownIds));
    }
  }, [products]);

  const handleOpenLowStockAlert = () => {
    const allLowStockProducts = products.filter(p => p.stock <= p.minStock);
    if (allLowStockProducts.length > 0) {
      setLowStockProducts(allLowStockProducts);
      setIsLowStockAlertOpen(true);
    }
  };

  const handleOrderStatusClick = (status: string) => {
    navigate(`/vendas/pedidos?status=${status}`);
  };

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
        <KpiCard {...revenueKpi} />
        <KpiCard {...soldItemsKpi} />
        <StockAlertsCard onClick={handleOpenLowStockAlert} />
        <MarginChartCard value={marginKpi.value} change={marginKpi.change} />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Status dos Pedidos de Venda</CardTitle>
            <CardDescription>Distribuição dos pedidos por status no período.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderStatusChart salesOrders={filteredSalesOrders} onStatusClick={handleOrderStatusClick} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <TopProductsCard salesOrders={filteredSalesOrders} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Movimentação de Estoque</CardTitle>
          <CardDescription>Entradas e saídas de unidades de produtos no período.</CardDescription>
        </CardHeader>
        <CardContent>
          <StockMovementChart salesOrders={filteredSalesOrders} purchaseOrders={filteredPurchaseOrders} />
        </CardContent>
      </Card>

      <AlertDialog open={isLowStockAlertOpen} onOpenChange={setIsLowStockAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Alerta de Estoque Baixo!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Os seguintes produtos atingiram o nível mínimo de estoque e precisam de atenção:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 overflow-y-auto pr-4">
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {lowStockProducts.map(product => (
                <li key={product.id}>
                  <Link to={`/estoque/${product.id}`} className="font-semibold hover:underline" onClick={() => setIsLowStockAlertOpen(false)}>
                    {product.description}
                  </Link>
                  <br />
                  <span className="text-muted-foreground">
                    Estoque atual: {product.stock} (Mínimo: {product.minStock})
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link to="/estoque">Ver Estoque</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Index;