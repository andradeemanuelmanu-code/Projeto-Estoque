import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockSuppliers, Supplier } from "@/data/suppliers";
import { SupplierCard } from "@/components/compras/SupplierCard";
import { SupplierForm } from "@/components/compras/SupplierForm";
import { showSuccess, showError } from "@/utils/toast";

const Fornecedores = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return suppliers;
    const lowercasedTerm = searchTerm.toLowerCase();
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(lowercasedTerm) ||
      supplier.cnpj.toLowerCase().includes(lowercasedTerm) ||
      supplier.email.toLowerCase().includes(lowercasedTerm) ||
      supplier.address.toLowerCase().includes(lowercasedTerm)
    );
  }, [suppliers, searchTerm]);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Fornecedores</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar fornecedores..."
              className="pl-8 w-full sm:w-auto md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenModal(null)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map(supplier => (
          <SupplierCard key={supplier.id} supplier={supplier} onEdit={handleOpenModal} onDelete={handleDeleteSupplier} />
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px] flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <SupplierForm supplier={editingSupplier} onSubmit={handleSaveSupplier} />
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" form="supplier-form">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Fornecedores;