import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { SalesOrder } from "@/data/salesOrders";

interface TopProductsCardProps {
  linkTo?: string;
  salesOrders: SalesOrder[];
}

export const TopProductsCard = ({ linkTo, salesOrders }: TopProductsCardProps) => {
  const topProducts = useMemo(() => {
    const productSales: { [key: string]: { id: string; name: string; quantity: number } } = {};

    salesOrders
      .filter(order => order.status === 'Faturado')
      .forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { id: item.productId, name: item.productName, quantity: 0 };
          }
          productSales[item.productId].quantity += item.quantity;
        });
      });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [salesOrders]);

  return (
    <DashboardCard title="Produtos Mais Vendidos" Icon={Star} linkTo={linkTo}>
      {topProducts.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {topProducts.map((product) => (
            <li key={product.id}>
              <Link to={`/estoque/${product.id}`} className="flex justify-between items-center hover:bg-muted p-1 rounded-md transition-colors">
                <span className="truncate text-muted-foreground">{product.name}</span>
                <span className="font-semibold">{product.quantity}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Nenhuma venda no período.
        </div>
      )}
    </DashboardCard>
  );
};