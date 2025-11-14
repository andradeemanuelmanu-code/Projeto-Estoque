import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MapComponent } from "@/components/mapa/MapComponent";
import { MapSidebar } from "@/components/mapa/MapSidebar";
import { useAppData } from "@/context/AppDataContext";

const Mapa = () => {
  const { customers: allCustomers, suppliers: allSuppliers } = useAppData();
  const [showCustomers, setShowCustomers] = useState(true);
  const [showSuppliers, setShowSuppliers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchParams] = useSearchParams();

  const locations = useMemo(() => {
    const customers = showCustomers ? allCustomers.map(c => ({ ...c, type: 'customer' })) : [];
    const suppliers = showSuppliers ? allSuppliers.map(s => ({ ...s, type: 'supplier' })) : [];
    
    const allLocations = [...customers, ...suppliers];

    return allLocations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [showCustomers, showSuppliers, searchTerm, allCustomers, allSuppliers]);

  useEffect(() => {
    const selectedId = searchParams.get('selectedId');
    if (selectedId && locations.length > 0) {
      const locationToSelect = locations.find(loc => loc.id === selectedId);
      if (locationToSelect) {
        setSelectedLocation(locationToSelect);
      }
    }
  }, [searchParams, locations]);

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

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
        onLocationSelect={handleLocationSelect}
      />
      <div className="w-full h-full">
        <MapComponent 
          locations={locations}
          selectedLocation={selectedLocation}
          onMarkerClick={handleLocationSelect}
        />
      </div>
    </div>
  );
};

export default Mapa;