import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PurchaseOrderTable } from "@/components/compras/PurchaseOrderTable";
import { useAppData } from "@/context/AppDataContext";
import { showSuccess } from "@/utils/toast";
import { PurchaseOrder } from "@/data/purchaseOrders";
import { PurchaseOrderDetailModal } from "@/components/compras/PurchaseOrderDetailModal";
import { PurchaseOrderForm } from "@/components/compras/PurchaseOrderForm";

const PedidosCompra = () => {
  const { purchaseOrders, cancelPurchaseOrder, suppliers, products, addPurchaseOrder } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
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
      setIsDetailModalOpen(true);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido? Se já foi recebido, o estoque será revertido.")) {
      cancelPurchaseOrder(orderId);
      showSuccess("Pedido de compra cancelado com sucesso!");
    }
  };

  const handleFormSubmit = (data: any) => {
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) return;

    const totalValue = data.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);

    const newOrder: Omit<PurchaseOrder, 'id' | 'number'> = {
      supplierId: supplier.id,
      supplierName: supplier.name,
      date: new Date().toISOString().split('T')[0],
      status: "Recebido",
      totalValue,
      items: data.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    addPurchaseOrder(newOrder);
    showSuccess("Pedido de compra criado e estoque atualizado!");
    setIsFormModalOpen(false);
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
          <Button onClick={() => setIsFormModalOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Pedido
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
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Novo Pedido de Compra</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-4">
            <PurchaseOrderForm
              suppliers={suppliers}
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

export default PedidosCompra;