import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { PurchaseOrderTable } from "@/components/compras/PurchaseOrderTable";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";
import { PurchaseOrder } from "@/data/purchaseOrders";
import { PurchaseOrderDetailModal } from "@/components/compras/PurchaseOrderDetailModal";

const PedidosCompra = () => {
  const { purchaseOrders, cancelPurchaseOrder } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return purchaseOrders;
    const lowercasedTerm = searchTerm.toLowerCase();
    return purchaseOrders.filter(order =>
      order.number.toLowerCase().includes(lowercasedTerm) ||
      order.supplierName.toLowerCase().includes(lowercasedTerm)
    );
  }, [purchaseOrders, searchTerm]);

  const handleViewDetails = (orderId: string) => {
    const order = purchaseOrders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido? Se já foi recebido, o estoque será revertido.")) {
      cancelPurchaseOrder(orderId);
      showSuccess("Pedido de compra cancelado com sucesso!");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Pedidos de Compra</h1>
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
          <Button asChild className="w-full sm:w-auto">
            <Link to="/compras/pedidos/novo">
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Pedido
            </Link>
          </Button>
        </div>
      </div>
      <PurchaseOrderTable 
        orders={filteredOrders} 
        onViewDetails={handleViewDetails}
        onCancel={handleCancelOrder}
      />
      <PurchaseOrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default PedidosCompra;