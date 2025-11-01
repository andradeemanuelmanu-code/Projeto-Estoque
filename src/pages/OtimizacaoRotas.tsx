import { useState, useMemo } from "react";
import axios from "axios";
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

  const getOptimizedRoute = async (start: Coordinates, points: Coordinates[]) => {
    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey || apiKey.includes("COLE_SUA_CHAVE")) {
      showError("Chave da API do OpenRouteService não configurada.");
      throw new Error("API key is missing.");
    }

    const coordinates = [
      [start.lng, start.lat],
      ...points.map(p => [p.lng, p.lat])
    ];

    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        { coordinates },
        {
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // A API retorna [longitude, latitude], então precisamos inverter para o Leaflet que espera [latitude, longitude]
      const routeCoordinates = response.data.features[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
      return routeCoordinates;

    } catch (error) {
      console.error("Erro ao buscar rota do OpenRouteService:", error);
      showError("Falha ao calcular a rota. Verifique a chave da API e a conexão.");
      throw error;
    }
  };

  const handleGenerateRoute = () => {
    setIsGenerating(true);
    const toastId = showLoading("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        dismissToast(toastId);
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userCoords);
        
        const processingToastId = showLoading("Calculando a rota otimizada...");
        
        try {
          const selectedCustomers = customers.filter(c => selectedCustomerIds.has(c.id));
          const customerCoords = selectedCustomers.map(c => ({ lat: c.lat, lng: c.lng }));
          
          const calculatedRoute = await getOptimizedRoute(userCoords, customerCoords);
          
          // Adiciona o ponto inicial e final para fechar o ciclo
          setRoute([userCoords, ...calculatedRoute, userCoords]);
          dismissToast(processingToastId);
          showSuccess("Rota gerada com sucesso!");
        } catch (error) {
          dismissToast(processingToastId);
        } finally {
          setIsGenerating(false);
        }
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