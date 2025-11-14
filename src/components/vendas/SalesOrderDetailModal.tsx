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
import { SalesOrder } from "@/types/SalesOrder";
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
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido de Venda</DialogTitle>
            <DialogDescription>Pedido #{order.number}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4 flex-1 overflow-y-auto pr-2">
            {/* Main content area */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Desktop Table */}
                  <div className="overflow-x-auto hidden md:block">
                    <Table>
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
                  {/* Mobile Card List */}
                  <div className="space-y-3 md:hidden">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <p className="font-semibold text-sm">{item.productName}</p>
                        <div className="flex justify-between text-xs mt-2 pt-2 border-t">
                          <span className="text-muted-foreground">Qtd:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Preço Unit.:</span>
                          <span>{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium mt-1 pt-1 border-t">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span>{(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar area */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  <p className="text-2xl font-bold">
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