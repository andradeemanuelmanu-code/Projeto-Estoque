import { useState } from "react";
import axios from "axios";
import { useAppData } from "@/context/AppDataContext";
import { CustomerSelectionSidebar } from "@/components/otimizacao/CustomerSelectionSidebar";
import { RouteMap } from "@/components/otimizacao/RouteMap";
import { showError, showLoading, dismissToast, showSuccess } from "@/utils/toast";
import { Customer } from "@/data/customers";

type Coordinates = { lat: number; lng: number };
type OrderedCustomer = Customer & { sequence: number };

const OtimizacaoRotas = () => {
  const { customers } = useAppData();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [outboundRoute, setOutboundRoute] = useState<Coordinates[] | null>(null);
  const [returnRoute, setReturnRoute] = useState<Coordinates[] | null>(null);
  const [orderedCustomers, setOrderedCustomers] = useState<OrderedCustomer[] | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) newSet.delete(customerId);
      else newSet.add(customerId);
      return newSet;
    });
  };

  const handleGenerateRoute = () => {
    setIsGenerating(true);
    const toastId = showLoading("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        dismissToast(toastId);
        const userCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(userCoords);
        
        const processingToastId = showLoading("Calculando a rota otimizada...");
        
        try {
          const apiKey = import.meta.env.VITE_ORS_API_KEY;
          if (!apiKey || apiKey.includes("COLE_SUA_CHAVE")) {
            throw new Error("Chave da API do OpenRouteService não configurada.");
          }

          const selected = customers.filter(c => selectedCustomerIds.has(c.id));
          const idMap = new Map(selected.map((customer, index) => [index, customer.id]));
          const customerMap = new Map(selected.map(customer => [customer.id, customer]));

          const headers = {
            'Authorization': apiKey,
          };

          // ETAPA 1: Obter a ordem otimizada do endpoint de otimização
          const optimizationRequest = {
            jobs: selected.map((customer, index) => ({
              id: index,
              location: [customer.lng, customer.lat]
            })),
            vehicles: [{
              id: 1,
              profile: 'driving-car',
              start: [userCoords.lng, userCoords.lat],
              end: [userCoords.lng, userCoords.lat]
            }]
          };

          const optimizationResponse = await axios.post(
            '/ors-api/v2/optimization',
            optimizationRequest,
            { headers }
          );

          const orderedSteps = optimizationResponse.data.routes[0].steps;
          const jobSteps = orderedSteps.filter((step: any) => step.type === 'job');
          
          const orderedCustomerIds = jobSteps.map((step: any) => idMap.get(step.id));
          const sequencedCustomers: OrderedCustomer[] = orderedCustomerIds.map((id: string, index: number) => {
            const customer = customerMap.get(id)!;
            return { ...customer, sequence: index + 1 };
          });
          setOrderedCustomers(sequencedCustomers);

          // ETAPA 2: Obter a geometria da rota do endpoint de direções usando a ordem otimizada
          const orderedCoordinates = [
            [userCoords.lng, userCoords.lat],
            ...sequencedCustomers.map(c => [c.lng, c.lat]),
            [userCoords.lng, userCoords.lat]
          ];

          const directionsResponse = await axios.post(
            '/ors-api/v2/directions/driving-car/geojson',
            { coordinates: orderedCoordinates },
            { headers }
          );

          // ETAPA 3: Processar a resposta das direções para dividir a rota
          const feature = directionsResponse.data.features[0];
          const segments = feature.properties.segments;
          const allCoordinates = feature.geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));

          const lastSegmentIndex = segments.length - 1;
          let returnTripStartIndexInCoords = 0;
          for (let i = 0; i < lastSegmentIndex; i++) {
            returnTripStartIndexInCoords = segments[i].way_points[1];
          }
          
          const outboundPath = allCoordinates.slice(0, returnTripStartIndexInCoords + 1);
          const returnPath = allCoordinates.slice(returnTripStartIndexInCoords);

          setOutboundRoute(outboundPath);
          setReturnRoute(returnPath);
          
          dismissToast(processingToastId);
          showSuccess("Rota gerada com sucesso!");
        } catch (error) {
          console.error("Erro ao gerar rota:", error);
          let errorMessage = "Falha ao calcular a rota.";
          if (error.message === "Network Error") {
            errorMessage = "Erro de Rede: Não foi possível conectar à API. Verifique sua conexão e se a chave da API (VITE_ORS_API_KEY) está correta.";
          } else if (error.response) {
            errorMessage = `Erro da API (${error.response.status}): ${error.response.data?.error?.message || 'Resposta inválida'}`;
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
      />
      <div className="w-full h-full">
        <RouteMap
          orderedCustomers={orderedCustomers}
          outboundRoute={outboundRoute}
          returnRoute={returnRoute}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
};

export default OtimizacaoRotas;