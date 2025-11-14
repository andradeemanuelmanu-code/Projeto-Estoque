import { useMemo } from "react";
import { Archive } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InventoryValueCard = () => {
  const { products } = useAppData();
  const totalItems = useMemo(() => {
    return products.reduce((acc, product) => acc + product.stock, 0);
  }, [products]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total de Itens em Estoque
        </CardTitle>
        <Archive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalItems.toLocaleString('pt-BR')} Unidades
        </div>
        <p className="text-xs text-muted-foreground">
          Soma de todas as unidades de produtos em estoque.
        </p>
      </CardContent>
    </Card>
  );
};