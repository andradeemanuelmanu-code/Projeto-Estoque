import { useState } from "react";
import axios from "axios";
import { useAppData } from "@/context/AppDataContext";
import { CustomerSelectionSidebar } from "@/components/otimizacao/CustomerSelectionSidebar";
import { RouteMap } from "@/components/otimizacao/RouteMap";
import { showError, showLoading, dismissToast, showSuccess } from "@/utils/toast";
import { Customer } from "@/data/customers";

type Coordinates = { lat: number; lng: number };
type OrderedCustomer = Customer & { sequence: number };
type RouteSummary = {
  distance: number; // em metros
  duration: number; // em segundos
  tollCount: number;
};

const OtimizacaoRotas = () => {
  const { customers } = useAppData();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [outboundRoute, setOutboundRoute] = useState<Coordinates[] | null>(null);
  const [returnRoute, setReturnRoute] = useState<Coordinates[] | null>(null);
  const [orderedCustomers, setOrderedCustomers] = useState<OrderedCustomer[] | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [tollLocations, setTollLocations] = useState<Coordinates[] | null>(null);

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) newSet.delete(customerId);
      else newSet.add(customerId);
      return newSet;
    });
    setOutboundRoute(null);
    setReturnRoute(null);
    setOrderedCustomers(null);
    setRouteSummary(null);
    setTollLocations(null);
  };

  const handleGenerateRoute = () => {
    if (selectedCustomerIds.size < 1) {
      showError("Selecione pelo menos um cliente para gerar a rota.");
      return;
    }

    setIsGenerating(true);
    setOutboundRoute(null);
    setReturnRoute(null);
    setOrderedCustomers(null);
    setRouteSummary(null);
    setTollLocations(null);
    const toastId = showLoading("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        dismissToast(toastId);
        const userCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(userCoords);
        
        const processingToastId = showLoading("Calculando a rota...");
        
        try {
          const apiKey = import.meta.env.VITE_ORS_API_KEY;
          if (!apiKey || apiKey.includes("COLE_SUA_CHAVE")) {
            throw new Error("Chave da API do OpenRouteService não configurada.");
          }

          const selected = customers.filter(c => selectedCustomerIds.has(c.id));
          const sequencedCustomers: OrderedCustomer[] = selected.map((customer, index) => ({
            ...customer,
            sequence: index + 1,
          }));
          setOrderedCustomers(sequencedCustomers);

          const coordinates = [
            [userCoords.lng, userCoords.lat],
            ...selected.map(c => [c.lng, c.lat]),
            [userCoords.lng, userCoords.lat]
          ];

          const headers = { 'Authorization': apiKey, 'Content-Type': 'application/json' };
          const body = { coordinates, extra_info: ["tollways"] };

          const directionsResponse = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car/geojson', body, { headers });

          const feature = directionsResponse.data.features[0];
          const allCoordinates = feature.geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));
          
          const tollData = feature.properties.extras?.tollways?.values || [];
          const currentTollLocations: Coordinates[] = [];
          let tollCount = 0;
          let onTollway = false;
          tollData.forEach(([startIndex, , type]: [number, number, number]) => {
            if (type > 0 && !onTollway) {
              tollCount++;
              onTollway = true;
              currentTollLocations.push(allCoordinates[startIndex]);
            } else if (type === 0) {
              onTollway = false;
            }
          });
          setTollLocations(currentTollLocations);

          const summary = feature.properties.summary;
          setRouteSummary({
            distance: summary.distance,
            duration: summary.duration,
            tollCount: tollCount,
          });
          
          setOutboundRoute(allCoordinates);
          setReturnRoute(null);
          
          dismissToast(processingToastId);
          showSuccess("Rota gerada com sucesso!");

        } catch (error) {
          console.error("Erro ao gerar rota:", error);
          let errorMessage = "Falha ao calcular a rota.";
          if (error.response) {
            errorMessage = `Erro da API (${error.response.status}): ${error.response.data?.error?.message || 'Resposta inválida'}`;
          } else if (error.request) {
            errorMessage = "Erro de Rede: Não foi possível conectar à API. Verifique sua conexão.";
          } else {
            errorMessage = error.message;
          }
          showError(errorMessage);
          dismissToast(processingToastId);
        } finally {
          setIsGenerating(false);
        }
      },
      (error) => {
        dismissToast(toastId);
        showError("Não foi possível obter sua localização.");
        setIsGenerating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[calc(100vh-60px)]">
      <CustomerSelectionSidebar
        customers={customers}
        selectedCustomerIds={selectedCustomerIds}
        onCustomerToggle={handleCustomerToggle}
        onGenerateRoute={handleGenerateRoute}
        isGenerating={isGenerating}
        routeSummary={routeSummary}
      />
      <div className="w-full h-full">
        <RouteMap
          orderedCustomers={orderedCustomers}
          outboundRoute={outboundRoute}
          returnRoute={returnRoute}
          userLocation={userLocation}
          tollLocations={tollLocations}
        />
      </div>
    </div>
  );
};

export default OtimizacaoRotas;