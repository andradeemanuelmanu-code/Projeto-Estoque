import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Route, Loader2, Milestone, Clock, Ticket } from "lucide-react";
import { Customer } from "@/data/customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerSelectionSidebarProps {
  customers: Customer[];
  selectedCustomerIds: Set<string>;
  onCustomerToggle: (customerId: string) => void;
  onGenerateRoute: () => void;
  isGenerating: boolean;
  routeSummary: { distance: number; duration: number; tollCount: number } | null;
}

const formatDistance = (meters: number) => {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return `${h}h ${m}min`;
  }
  return `${m}min`;
};

export const CustomerSelectionSidebar = ({
  customers,
  selectedCustomerIds,
  onCustomerToggle,
  onGenerateRoute,
  isGenerating,
  routeSummary,
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

      {routeSummary && (
        <div className="p-4 border-t">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resumo da Rota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Milestone className="h-4 w-4" />
                  <span>Distância Total</span>
                </div>
                <span className="font-semibold">{formatDistance(routeSummary.distance)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Tempo Estimado</span>
                </div>
                <span className="font-semibold">{formatDuration(routeSummary.duration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ticket className="h-4 w-4" />
                  <span>Quantidade de Pedágios</span>
                </div>
                <span className="font-semibold">{routeSummary.tollCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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