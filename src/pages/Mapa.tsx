import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MapComponent } from "@/components/mapa/MapComponent";
import { MapSidebar } from "@/components/mapa/MapSidebar";
import { useAppData } from "@/context/AppDataContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const Mapa = () => {
  const { customers: allCustomers, suppliers: allSuppliers } = useAppData();
  const [showCustomers, setShowCustomers] = useState(true);
  const [showSuppliers, setShowSuppliers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  const sidebarProps = {
    locations,
    showCustomers,
    setShowCustomers,
    showSuppliers,
    setShowSuppliers,
    searchTerm,
    setSearchTerm,
    selectedLocation,
    onLocationSelect: handleLocationSelect,
  };

  if (isMobile) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute top-4 left-4 z-[1000]">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtros e Locais
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px] p-0 flex flex-col">
              <MapSidebar {...sidebarProps} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="w-full h-full">
          <MapComponent 
            locations={locations}
            selectedLocation={selectedLocation}
            onMarkerClick={handleLocationSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-full">
      <MapSidebar {...sidebarProps} />
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