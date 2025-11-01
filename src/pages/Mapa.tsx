import { useState, useMemo } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { mockCustomers } from "@/data/customers";
import { mockSuppliers } from "@/data/suppliers";
import { Skeleton } from "@/components/ui/skeleton";
import { MapComponent } from "@/components/mapa/MapComponent";
import { MapSidebar } from "@/components/mapa/MapSidebar";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.error("Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env.local file.");
}

const libraries = ["places"];

const Mapa = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: libraries as any,
  });

  const [showCustomers, setShowCustomers] = useState(true);
  const [showSuppliers, setShowSuppliers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const locations = useMemo(() => {
    const customers = showCustomers ? mockCustomers.map(c => ({ ...c, type: 'customer' })) : [];
    const suppliers = showSuppliers ? mockSuppliers.map(s => ({ ...s, type: 'supplier' })) : [];
    
    const allLocations = [...customers, ...suppliers];

    return allLocations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [showCustomers, showSuppliers, searchTerm]);

  if (!API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-2">Google Maps API Key Faltando</h2>
        <p className="text-muted-foreground">
          Por favor, adicione sua chave da API do Google Maps à variável <code className="bg-muted px-1 py-0.5 rounded">VITE_GOOGLE_MAPS_API_KEY</code> no seu arquivo <code className="bg-muted px-1 py-0.5 rounded">.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[calc(100vh-60px)]">
      <MapSidebar
        locations={locations}
        showCustomers={showCustomers}
        setShowCustomers={setShowCustomers}
        showSuppliers={showSuppliers}
        setShowSuppliers={setShowSuppliers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        onLocationSelect={setSelectedLocation}
      />
      <div className="w-full h-full">
        {isLoaded ? (
          <MapComponent 
            locations={locations}
            selectedLocation={selectedLocation}
            onMarkerClick={setSelectedLocation}
          />
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>
    </div>
  );
};

export default Mapa;