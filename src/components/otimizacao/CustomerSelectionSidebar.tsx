import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Route, Loader2 } from "lucide-react";
import { Customer } from "@/data/customers";

interface CustomerSelectionSidebarProps {
  customers: Customer[];
  selectedCustomerIds: Set<string>;
  onCustomerToggle: (customerId: string) => void;
  onGenerateRoute: () => void;
  isGenerating: boolean;
}

export const CustomerSelectionSidebar = ({
  customers,
  selectedCustomerIds,
  onCustomerToggle,
  onGenerateRoute,
  isGenerating,
}: CustomerSelectionSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  return (
    <div className="flex flex-col bg-card border-r h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Otimizador de Rotas</h2>
        <div className="relative mt-4">
          <Input
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="p-4 border-b">
        <p className="text-sm font-medium">Selecione os Clientes</p>
        <p className="text-xs text-muted-foreground">
          {selectedCustomerIds.size} cliente(s) selecionado(s).
        </p>
      </div>
      <ScrollArea className="flex-1">
        {filteredCustomers.map(customer => (
          <div
            key={customer.id}
            className="flex items-center space-x-3 p-4 border-b"
          >
            <Checkbox
              id={`customer-${customer.id}`}
              checked={selectedCustomerIds.has(customer.id)}
              onCheckedChange={() => onCustomerToggle(customer.id)}
            />
            <Label htmlFor={`customer-${customer.id}`} className="flex flex-col cursor-pointer">
              <span className="font-semibold">{customer.name}</span>
              <span className="text-xs text-muted-foreground">{customer.address}</span>
            </Label>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          onClick={onGenerateRoute}
          disabled={isGenerating || selectedCustomerIds.size === 0}
          className="w-full"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Route className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? "Gerando Rota..." : "Gerar Rota Otimizada"}
        </Button>
      </div>
    </div>
  );
};