import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatusDialog } from "@/components/OrderStatusDialog";
import { showSuccess } from "@/utils/toast";
import { SalesOrder } from "@/data/salesOrders";
import { useAppData } from "@/context/AppDataContext";

interface SalesOrderDetailModalProps {
  order: SalesOrder | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const statusStyles = {
  Pendente: "bg-orange-500",
  Faturado: "bg-green-500",
  Cancelado: "bg-red-500",
};

export const SalesOrderDetailModal = ({ order, isOpen, onOpenChange }: SalesOrderDetailModalProps) => {
  const { updateSalesOrderStatus } = useAppData();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  if (!order) return null;

  const handleStatusSave = (newStatus: string) => {
    updateSalesOrderStatus(order.id, newStatus as SalesOrder['status']);
    showSuccess("Status do pedido atualizado com sucesso!");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-w-[95vw] h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido de Venda</DialogTitle>
            <DialogDescription>Pedido #{order.number}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-3 lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Informações Gerais</CardTitle>
                    <p className="text-sm text-muted-foreground">Cliente: {order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Data do Pedido</p>
                    <p className="text-sm">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
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

              <Card className="md:col-span-3 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-base">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="text-center">Qtd.</TableHead>
                          <TableHead className="text-right">Preço Unit.</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-sm">{item.productName}</TableCell>
                            <TableCell className="text-center text-sm">{item.quantity}</TableCell>
                            <TableCell className="text-right text-sm">{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell className="text-right text-sm">{(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <p className="text-xl font-bold">
                    {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-xs text-muted-foreground">Valor Total do Pedido</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <OrderStatusDialog
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        currentStatus={order.status}
        availableStatuses={["Pendente", "Faturado", "Cancelado"]}
        onSave={handleStatusSave}
        orderNumber={order.number}
      />
    </>
  );
};