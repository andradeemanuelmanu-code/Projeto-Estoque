import { useParams, Link } from "react-router-dom";
import { useAppData } from "@/context/AppDataContext";
import NotFound from "./NotFound";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductHistoryTable } from "@/components/estoque/ProductHistoryTable";
import { useProductHistory } from "@/hooks/useProductHistory";

const DetalhesProduto = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, salesOrders, purchaseOrders } = useAppData();

  const { product, movements } = useProductHistory(productId, {
    products,
    salesOrders,
    purchaseOrders,
  });

  if (!product) {
    return <NotFound />;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Link to="/estoque">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold md:text-2xl text-foreground">Detalhes do Produto</h1>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
            <CardDescription>Código: {product.code}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
            <div><span className="font-semibold text-muted-foreground">Categoria:</span> {product.category}</div>
            <div><span className="font-semibold text-muted-foreground">Marca:</span> {product.brand}</div>
            <div><span className="font-semibold text-muted-foreground">Estoque Atual:</span> {product.stock}</div>
            <div><span className="font-semibold text-muted-foreground">Estoque Mínimo:</span> {product.minStock}</div>
            <div><span className="font-semibold text-muted-foreground">Estoque Máximo:</span> {product.maxStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentação</CardTitle>
            <CardDescription>Entradas e saídas do estoque.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductHistoryTable movements={movements} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DetalhesProduto;