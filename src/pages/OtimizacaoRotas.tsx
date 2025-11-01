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
    if (selectedCustomerIds.size < 1) {
      showError("Selecione pelo menos um cliente para gerar a rota.");
      return;
    }

    setIsGenerating(true);
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
            [userCoords.lng, userCoords.lat] // Adiciona o ponto final de volta à origem
          ];

          const headers = {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          };

          const directionsResponse = await axios.post(
            '/ors-api/v2/directions/driving-car/geojson',
            { coordinates },
            { headers }
          );

          const feature = directionsResponse.data.features[0];
          const allCoordinates = feature.geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));
          
          // Para simplificar, vamos tratar tudo como uma única rota de ida
          setOutboundRoute(allCoordinates);
          setReturnRoute(null); // Limpamos a rota de volta por enquanto
          
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