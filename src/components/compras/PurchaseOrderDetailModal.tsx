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
import { PurchaseOrder } from "@/data/purchaseOrders";
import { useAppData } from "@/context/AppDataContext";

interface PurchaseOrderDetailModalProps {
  order: PurchaseOrder | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const statusStyles = {
  Pendente: "bg-orange-500",
  Recebido: "bg-green-500",
  Cancelado: "bg-red-500",
};

export const PurchaseOrderDetailModal = ({ order, isOpen, onOpenChange }: PurchaseOrderDetailModalProps) => {
  const { updatePurchaseOrderStatus } = useAppData();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  if (!order) return null;

  const handleStatusSave = (newStatus: string) => {
    updatePurchaseOrderStatus(order.id, newStatus as PurchaseOrder['status']);
    showSuccess("Status do pedido atualizado com sucesso!");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-w-[95vw] h-[85vh] md:h-[80vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Detalhes do Pedido de Compra</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">Pedido #{order.number}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-3 lg:col-span-3 p-3 md:p-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-4">
                <div>
                  <CardTitle className="text-base md:text-lg">Informações Gerais</CardTitle>
                  <p className="text-xs md:text-sm text-muted-foreground">Fornecedor: {order.supplierName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-muted-foreground">Data do Pedido</p>
                  <p className="text-xs md:text-sm">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2 md:pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-medium">Status:</span>
                  <Badge className={cn("text-white text-xs md:text-sm", statusStyles[order.status])}>{order.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={() => setIsStatusModalOpen(true)}>
                    <Pencil className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 lg:col-span-3 p-3 md:p-4">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 md:pt-4">
                <div className="overflow-x-auto -mx-2 px-2">
                  <Table className="min-w-[500px] text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtd.</TableHead>
                        <TableHead className="text-right">Custo Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs md:text-sm">{item.productName}</TableCell>
                          <TableCell className="text-center text-xs md:text-sm">{item.quantity}</TableCell>
                          <TableCell className="text-right text-xs md:text-sm">{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          <TableCell className="text-right text-xs md:text-sm">{(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-2 p-3 md:p-4">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 md:pt-4 text-right">
                <p className="text-lg md:text-xl font-bold">
                  {order.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Valor Total do Pedido</p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      
      <OrderStatusDialog
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        currentStatus={order.status}
        availableStatuses={["Pendente", "Recebido", "Cancelado"]}
        onSave={handleStatusSave}
        orderNumber={order.number}
      />
    </>
  );
};