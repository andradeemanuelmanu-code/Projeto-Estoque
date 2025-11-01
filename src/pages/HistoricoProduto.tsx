import { useParams, Link } from "react-router-dom";
import { useAppData } from "@/context/AppDataContext";
import NotFound from "./NotFound";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { ProductHistoryTable } from "@/components/estoque/ProductHistoryTable";

const HistoricoProduto = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, salesOrders, purchaseOrders } = useAppData();

  const product = products.find(p => p.id === productId);

  const movements = useMemo(() => {
    if (!product) return [];

    const purchaseMovements = purchaseOrders
      .filter(order => order.status === 'Recebido')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Entrada' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'purchase' as const,
            quantity: item.quantity,
          }))
      );

    const salesMovements = salesOrders
      .filter(order => order.status === 'Faturado')
      .flatMap(order =>
        order.items
          .filter(item => item.productId === product.id)
          .map(item => ({
            date: new Date(order.date),
            type: 'Saída' as const,
            document: order.number,
            documentId: order.id,
            documentType: 'sales' as const,
            quantity: -item.quantity,
          }))
      );

    const allMovements = [...purchaseMovements, ...salesMovements].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const totalMovementQuantity = allMovements.reduce((acc, mov) => acc + mov.quantity, 0);
    const initialStock = product.stock - totalMovementQuantity;

    let balance = initialStock;
    return allMovements.map(mov => {
      balance += mov.quantity;
      return { ...mov, balance };
    });

  }, [product, salesOrders, purchaseOrders]);

  if (!product) {
    return <NotFound />;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Link to="/estoque">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Histórico do Produto</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{product.description}</CardTitle>
          <CardDescription>Código: {product.code}</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="text-sm"><span className="font-semibold text-muted-foreground">Categoria:</span> {product.category}</div>
          <div className="text-sm"><span className="font-semibold text-muted-foreground">Marca:</span> {product.brand}</div>
          <div className="text-sm"><span className="font-semibold text-muted-foreground">Estoque Atual:</span> {product.stock}</div>
        </CardContent>
      </Card>

      <h2 className="text-md font-semibold md:text-xl text-foreground mb-4">Movimentações de Estoque</h2>
      <ProductHistoryTable movements={movements} />
    </>
  );
};

export default HistoricoProduto;