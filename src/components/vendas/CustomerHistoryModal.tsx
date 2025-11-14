import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { Customer } from "@/types/Customer";
import { SalesOrder } from "@/types/SalesOrder";
import { SalesOrderTable } from "./SalesOrderTable";
import { SalesOrderDetailModal } from "./SalesOrderDetailModal";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customer: Customer | null;
  orders: SalesOrder[];
}

export const CustomerHistoryModal = ({ isOpen, onOpenChange, customer, orders }: CustomerHistoryModalProps) => {
  const { salesOrders, cancelSalesOrder } = useAppData();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  if (!customer) return null;

  const handleViewDetails = (orderId: string) => {
    const order = salesOrders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido? O estoque dos itens será revertido.")) {
      cancelSalesOrder(orderId);
      showSuccess("Pedido cancelado com sucesso!");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Histórico do Cliente</DialogTitle>
            <DialogDescription>Pedidos de venda realizados pelo cliente.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-4">
            <Card className="mb-6">
              <CardHeader>
                <DialogTitle>{customer.name}</DialogTitle>
                <DialogDescription>{customer.cpfCnpj}</DialogDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{customer.email}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{customer.phone}</span></div>
                </div>
                <div className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /> <span>{customer.address}</span></div>
              </CardContent>
            </Card>
            <SalesOrderTable 
              orders={orders} 
              onViewDetails={handleViewDetails}
              onCancel={handleCancelOrder}
            />
          </div>
        </DialogContent>
      </Dialog>
      <SalesOrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </>
  );
};