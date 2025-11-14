import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useAppData } from "@/context/AppDataContext";

interface StockAlertsCardProps {
  onClick?: () => void;
}

export const StockAlertsCard = ({ onClick }: StockAlertsCardProps) => {
  const { products } = useAppData();
  const lowStockCount = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock).length;
  }, [products]);

  return (
    <DashboardCard title="Alertas de Estoque" Icon={AlertTriangle} onClick={onClick}>
      <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
      <p className="text-xs text-muted-foreground">
        Produtos abaixo do estoque mínimo
      </p>
    </DashboardCard>
  );
};