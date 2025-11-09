import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { PurchaseOrderTable } from "@/components/compras/PurchaseOrderTable";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";

const PedidosCompra = () => {
  const { purchaseOrders, cancelPurchaseOrder } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return purchaseOrders;
    const lowercasedTerm = searchTerm.toLowerCase();
    return purchaseOrders.filter(order =>
      order.number.toLowerCase().includes(lowercasedTerm) ||
      order.supplierName.toLowerCase().includes(lowercasedTerm)
    );
  }, [purchaseOrders, searchTerm]);

  const handleViewDetails = (orderId: string) => {
    navigate(`/compras/pedidos/${orderId}`);
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido? Se já foi recebido, o estoque será revertido.")) {
      cancelPurchaseOrder(orderId);
      showSuccess("Pedido de compra cancelado com sucesso!");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Pedidos de Compra</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedidos..."
              className="pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
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
    </>
  );
};

export default PedidosCompra;