import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { mockPurchaseOrders, PurchaseOrder } from "@/data/purchaseOrders";
import { PurchaseOrderTable } from "@/components/compras/PurchaseOrderTable";

const PedidosCompra = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Pedidos de Compra</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar pedidos..." className="pl-8 sm:w-[300px]" />
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>
      <PurchaseOrderTable orders={orders} />
    </>
  );
};

export default PedidosCompra;