import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockSuppliers, Supplier } from "@/data/suppliers";
import { SupplierCard } from "@/components/compras/SupplierCard";
import { SupplierForm } from "@/components/compras/SupplierForm";
import { showSuccess, showError } from "@/utils/toast";

const Fornecedores = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const handleOpenModal = (supplier: Supplier | null) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSaveSupplier = (data: Omit<Supplier, 'id'>) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...editingSupplier, ...data } : s));
      showSuccess("Fornecedor atualizado!");
    } else {
      const newSupplier: Supplier = { id: `sup_${Date.now()}`, ...data };
      setSuppliers([newSupplier, ...suppliers]);
      showSuccess("Fornecedor cadastrado!");
    }
    handleCloseModal();
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (window.confirm("Tem certeza?")) {
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
      showError("Fornecedor excluído.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Fornecedores</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar fornecedores..." className="pl-8 sm:w-[300px]" />
          </div>
          <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map(supplier => (
          <SupplierCard key={supplier.id} supplier={supplier} onEdit={handleOpenModal} onDelete={handleDeleteSupplier} />
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
          </DialogHeader>
          <SupplierForm supplier={editingSupplier} onSubmit={handleSaveSupplier} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Fornecedores;