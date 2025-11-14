import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export const MapSidebar = ({
  locations,
  showCustomers,
  setShowCustomers,
  showSuppliers,
  setShowSuppliers,
  searchTerm,
  setSearchTerm,
  selectedLocation,
  onLocationSelect,
}) => {
  const handleTraceRoute = () => {
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col bg-card border-r h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Filtros e Locais</h2>
        <div className="relative mt-4">
          <Input
            placeholder="Buscar local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="customers" checked={showCustomers} onCheckedChange={setShowCustomers} />
            <Label htmlFor="customers">Clientes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="suppliers" checked={showSuppliers} onCheckedChange={setShowSuppliers} />
            <Label htmlFor="suppliers">Fornecedores</Label>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {locations.map(location => (
          <div
            key={location.id}
            className={`p-4 border-b cursor-pointer hover:bg-muted ${selectedLocation?.id === location.id ? 'bg-muted' : ''}`}
            onClick={() => onLocationSelect(location)}
          >
            <p className="font-semibold">{location.name}</p>
            <p className="text-sm text-muted-foreground">{location.address}</p>
          </div>
        ))}
      </ScrollArea>
      {selectedLocation && (
        <div className="p-4 border-t">
          <Card>
            <CardHeader>
              <CardTitle>{selectedLocation.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{selectedLocation.address}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{selectedLocation.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{selectedLocation.phone}</span></div>
              <Button onClick={handleTraceRoute} className="w-full mt-4">
                <ExternalLink className="mr-2 h-4 w-4" /> Traçar Rota
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};