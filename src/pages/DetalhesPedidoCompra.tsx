import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppData } from "@/context/AppDataContext";
import NotFound from "./NotFound";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatusDialog } from "@/components/OrderStatusDialog";
import { showSuccess } from "@/utils/toast";
import { PurchaseOrder } from "@/data/purchaseOrders";

const statusStyles = {
  Pendente: "bg-orange-500",
  Recebido: "bg-green-500",
  Cancelado: "bg-red-500",
};

const DetalhesPedidoCompra = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { purchaseOrders, updatePurchaseOrderStatus } = useAppData();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const order = purchaseOrders.find(o => o.id === orderId);

  if (!order) {
    return <NotFound />;
  }

  const handleStatusSave = (newStatus: string) => {
    if (order) {
      updatePurchaseOrderStatus(order.id, newStatus as PurchaseOrder['status']);
      showSuccess("Status do pedido atualizado com sucesso!");
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Link to="/compras/pedidos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold md:text-2xl text-foreground">Detalhes do Pedido de Compra</h1>
          <p className="text-sm text-muted-foreground">Pedido #{order.number}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Fornecedor: {order.supplierName}</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Data do Pedido</p>
              <p>{new Date(order.date).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={cn("text-white", statusStyles[order.status])}>{order.status}</Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsStatusModalOpen(true)}>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Custo Unitário</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell className="text-right">{(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-start-3">
            <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="text-right">
                <p className="text-2xl font-bold">
                    {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-sm text-muted-foreground">Valor Total do Pedido</p>
            </CardContent>
        </Card>
      </div>

      {order && (
        <OrderStatusDialog
          isOpen={isStatusModalOpen}
          onOpenChange={setIsStatusModalOpen}
          currentStatus={order.status}
          availableStatuses={["Pendente", "Recebido", "Cancelado"]}
          onSave={handleStatusSave}
          orderNumber={order.number}
        />
      )}
    </>
  );
};

export default DetalhesPedidoCompra;