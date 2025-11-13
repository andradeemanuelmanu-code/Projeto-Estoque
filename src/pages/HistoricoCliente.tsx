import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { SalesOrderTable } from "@/components/vendas/SalesOrderTable";
import NotFound from "./NotFound";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";
import { SalesOrder } from "@/data/salesOrders";
import { SalesOrderDetailModal } from "@/components/vendas/SalesOrderDetailModal";

const HistoricoCliente = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { customers, salesOrders, cancelSalesOrder } = useAppData();
  
  const customer = customers.find(c => c.id === customerId);
  const customerOrders = salesOrders.filter(o => o.customerId === customerId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  if (!customer) {
    return <NotFound />;
  }

  const handleViewDetails = (orderId: string) => {
    const order = salesOrders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
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
      <div className="flex items-center gap-4 mb-4">
        <Link to="/vendas/clientes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Histórico do Cliente</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
          <CardDescription>{customer.cpfCnpj}</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{customer.email}</span></div>
            <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> <span>{customer.phone}</span></div>
          </div>
          <div className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" /> <span>{customer.address}</span></div>
        </CardContent>
      </Card>

      <h2 className="text-md font-semibold md:text-xl text-foreground mb-4">Pedidos de Venda</h2>
      <SalesOrderTable 
        orders={customerOrders} 
        onViewDetails={handleViewDetails}
        onCancel={handleCancelOrder}
      />
      <SalesOrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default HistoricoCliente;