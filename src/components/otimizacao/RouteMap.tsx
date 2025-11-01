import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useEffect } from "react";

// Ícones para o mapa
const customerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
const userLocationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="32" height="32"><circle cx="12" cy="12" r="8" fill-opacity="0.7"/><circle cx="12" cy="12" r="8" stroke="#fff" stroke-width="2"><animate attributeName="r" from="8" to="12" dur="1.5s" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/></circle></svg>`;

const customerIcon = new L.DivIcon({ html: customerSvg, className: '', iconSize: [32, 32], iconAnchor: [16, 32] });
const userLocationIcon = new L.DivIcon({ html: userLocationSvg, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });

// Componente para ajustar a visão do mapa
const ChangeView = ({ bounds }: { bounds: L.LatLngBoundsExpression | null }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    }
  }, [bounds, map]);
  return null;
};

export const RouteMap = ({ locations, route, userLocation }) => {
  const center: L.LatLngExpression = [-14.235004, -51.92528];

  const routeBounds = route && route.length > 0 ? L.latLngBounds(route) : null;

  return (
    <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
      <ChangeView bounds={routeBounds} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={customerIcon}
        />
      ))}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
        />
      )}
      {route && <Polyline pathOptions={{ color: 'blue' }} positions={route} />}
    </MapContainer>
  );
};