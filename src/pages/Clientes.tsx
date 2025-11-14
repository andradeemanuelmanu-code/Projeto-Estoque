import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Customer } from "@/types/Customer";
import { CustomerCard } from "@/components/vendas/CustomerCard";
import { CustomerForm } from "@/components/vendas/CustomerForm";
import { showSuccess, showError } from "@/utils/toast";
import { useAppData } from "@/context/AppDataContext";
import { CustomerHistoryModal } from "@/components/vendas/CustomerHistoryModal";
import { SalesOrder } from "@/types/SalesOrder";

const Clientes = () => {
  const { customers: initialCustomers, salesOrders } = useAppData();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<SalesOrder[]>([]);

  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lowercasedTerm = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedTerm) ||
      customer.cpfCnpj.toLowerCase().includes(lowercasedTerm) ||
      customer.email.toLowerCase().includes(lowercasedTerm) ||
      customer.address.toLowerCase().includes(lowercasedTerm)
    );
  }, [customers, searchTerm]);

  const handleOpenModal = (customer: Customer | null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = (data: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...data } : c));
      showSuccess("Cliente atualizado!");
    } else {
      const newCustomer: Customer = { id: `cust_${Date.now()}`, ...data };
      setCustomers([newCustomer, ...customers]);
      showSuccess("Cliente cadastrado!");
    }
    handleCloseModal();
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Tem certeza?")) {
      setCustomers(customers.filter(c => c.id !== customerId));
      showError("Cliente excluído.");
    }
  };

  const handleViewHistory = (customer: Customer) => {
    const orders = salesOrders.filter(o => o.customerId === customer.id);
    setSelectedCustomer(customer);
    setCustomerOrders(orders);
    setIsHistoryModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Clientes</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes..."
              className="pl-8 w-full sm:w-auto md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenModal(null)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map(customer => (
          <CustomerCard 
            key={customer.id} 
            customer={customer} 
            onEdit={handleOpenModal} 
            onDelete={handleDeleteCustomer}
            onViewHistory={handleViewHistory}
          />
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <CustomerForm customer={editingCustomer} onSubmit={handleSaveCustomer} onCancel={handleCloseModal} />
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit" form="customer-form">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CustomerHistoryModal
        isOpen={isHistoryModalOpen}
        onOpenChange={setIsHistoryModalOpen}
        customer={selectedCustomer}
        orders={customerOrders}
      />
    </>
  );
};

export default Clientes;