import { useState, useMemo } from "react";
import { useAppData } from "@/context/AppDataContext";
import { CustomerSelectionSidebar } from "@/components/otimizacao/CustomerSelectionSidebar";
import { RouteMap } from "@/components/otimizacao/RouteMap";
import { showError, showLoading, dismissToast, showSuccess } from "@/utils/toast";

type Coordinates = { lat: number; lng: number };

const OtimizacaoRotas = () => {
  const { customers } = useAppData();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [route, setRoute] = useState<Coordinates[] | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const handleGenerateRoute = () => {
    setIsGenerating(true);
    const toastId = showLoading("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dismissToast(toastId);
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userCoords);
        
        const processingToastId = showLoading("Calculando a rota otimizada...");
        
        // Simula o cálculo da rota
        setTimeout(() => {
          const selectedCustomers = customers.filter(c => selectedCustomerIds.has(c.id));
          const customerCoords = selectedCustomers.map(c => ({ lat: c.lat, lng: c.lng }));
          
          // A lógica de otimização real (ex: API do Google Maps) iria aqui.
          // Para demonstração, apenas conectamos os pontos.
          const calculatedRoute = [userCoords, ...customerCoords, userCoords];
          
          setRoute(calculatedRoute);
          dismissToast(processingToastId);
          showSuccess("Rota gerada com sucesso!");
          setIsGenerating(false);
        }, 1500);
      },
      (error) => {
        dismissToast(toastId);
        showError("Não foi possível obter sua localização. Verifique as permissões do navegador.");
        console.error("Geolocation error:", error);
        setIsGenerating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const locationsToDisplay = useMemo(() => {
    return customers.filter(c => selectedCustomerIds.has(c.id));
  }, [customers, selectedCustomerIds]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[calc(100vh-60px)]">
      <CustomerSelectionSidebar
        customers={customers}
        selectedCustomerIds={selectedCustomerIds}
        onCustomerToggle={handleCustomerToggle}
        onGenerateRoute={handleGenerateRoute}
        isGenerating={isGenerating}
      />
      <div className="w-full h-full">
        <RouteMap
          locations={locationsToDisplay}
          route={route}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
};

export default OtimizacaoRotas;