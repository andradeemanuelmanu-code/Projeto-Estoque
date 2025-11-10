import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, AlertTriangle } from "lucide-react";
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
import { InventoryValueCard } from "@/components/relatorios/InventoryValueCard";
import { Product } from "@/data/products";

const Index = () => {
  const [period, setPeriod] = useState('month');
  const { salesOrders, products } = useAppData();
  const [isLowStockAlertOpen, setIsLowStockAlertOpen] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Identificar todos os produtos com estoque baixo atualmente.
    const currentLowStockProducts = products.filter(p => p.stock <= p.minStock);

    if (currentLowStockProducts.length === 0) {
      return; // Se não há produtos com estoque baixo, não faz nada.
    }

    // 2. Recuperar os IDs dos produtos cujos alertas já foram exibidos nesta sessão.
    const shownAlertsRaw = sessionStorage.getItem('shownLowStockProductIds');
    const shownProductIds: string[] = shownAlertsRaw ? JSON.parse(shownAlertsRaw) : [];

    // 3. Filtrar para encontrar apenas os produtos que são novos alertas.
    const newProductsToShow = currentLowStockProducts.filter(
      p => !shownProductIds.includes(p.id)
    );

    // 4. Se houver novos produtos para alertar, mostrar o pop-up.
    if (newProductsToShow.length > 0) {
      setLowStockProducts(newProductsToShow);
      setIsLowStockAlertOpen(true);

      // 5. Atualizar a lista de alertas exibidos na sessão.
      const newShownIds = newProductsToShow.map(p => p.id);
      const updatedShownIds = [...new Set([...shownProductIds, ...newShownIds])];
      sessionStorage.setItem('shownLowStockProductIds', JSON.stringify(updatedShownIds));
    }
  }, [products]);

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
                  <strong>{product.description}</strong>
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