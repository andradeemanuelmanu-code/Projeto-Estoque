import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SalesOrderTable } from "@/components/vendas/SalesOrderTable";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";
import { SalesOrder } from "@/data/salesOrders";
import { SalesOrderDetailModal } from "@/components/vendas/SalesOrderDetailModal";
import { SalesOrderForm } from "@/components/vendas/SalesOrderForm";

const PedidosVenda = () => {
  const { salesOrders, cancelSalesOrder, customers, products, addSalesOrder } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

  const filteredOrders = useMemo(() => {
    return salesOrders.filter(order => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        order.number.toLowerCase().includes(lowercasedTerm) ||
        order.customerName.toLowerCase().includes(lowercasedTerm);
      
      const matchesStatus = !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [salesOrders, searchTerm, statusFilter]);

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

  const handleFormSubmit = (data: any) => {
    const customer = customers.find(c => c.id === data.customerId);
    if (!customer) return;

    const totalValue = data.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);

    const newOrder: Omit<SalesOrder, 'id' | 'number'> = {
      customerId: customer.id,
      customerName: customer.name,
      date: new Date().toISOString().split('T')[0],
      status: "Pendente",
      totalValue,
      items: data.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    addSalesOrder(newOrder);
    showSuccess("Pedido de venda criado com sucesso!");
    setIsFormModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl text-foreground">Pedidos de Venda</h1>
          {statusFilter && <p className="text-sm text-muted-foreground">Filtrando por status: {statusFilter}</p>}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedidos..."
              className="pl-8 w-full sm:w-auto md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsFormModalOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>
      <SalesOrderTable 
        orders={filteredOrders} 
        onViewDetails={handleViewDetails}
        onCancel={handleCancelOrder}
      />
      <SalesOrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Novo Pedido de Venda</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-4">
            <SalesOrderForm
              customers={customers}
              products={products}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PedidosVenda;