import { useMemo } from "react";
import { Archive } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StockValueCard = () => {
  const { products, purchaseOrders } = useAppData();

  const totalStockValue = useMemo(() => {
    const avgCosts = new Map<string, number>();

    // Calcula o custo médio ponderado de cada produto
    const costData: { [productId: string]: { totalCost: number; totalQuantity: number } } = {};
    purchaseOrders.forEach(order => {
      if (order.status === 'Recebido') {
        order.items.forEach(item => {
          if (!costData[item.productId]) {
            costData[item.productId] = { totalCost: 0, totalQuantity: 0 };
          }
          costData[item.productId].totalCost += item.unitPrice * item.quantity;
          costData[item.productId].totalQuantity += item.quantity;
        });
      }
    });

    Object.keys(costData).forEach(productId => {
      const { totalCost, totalQuantity } = costData[productId];
      if (totalQuantity > 0) {
        avgCosts.set(productId, totalCost / totalQuantity);
      }
    });

    // Calcula o valor total do estoque
    return products.reduce((acc, product) => {
      const avgCost = avgCosts.get(product.id) || 0;
      return acc + (product.stock * avgCost);
    }, 0);
  }, [products, purchaseOrders]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Valor do Estoque (Custo)
        </CardTitle>
        <Archive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalStockValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        <p className="text-xs text-muted-foreground">
          Valor total dos produtos em estoque a preço de custo.
        </p>
      </CardContent>
    </Card>
  );
};