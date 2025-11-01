import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import { useEffect } from "react";

// Ícones para o mapa
const userLocationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="32" height="32"><circle cx="12" cy="12" r="8" fill-opacity="0.7"/><circle cx="12" cy="12" r="8" stroke="#fff" stroke-width="2"><animate attributeName="r" from="8" to="12" dur="1.5s" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/></circle></svg>`;
const userLocationIcon = new L.DivIcon({ html: userLocationSvg, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });

const tollSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f97316" width="28" height="28"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c2.14-.46 3.5-1.78 3.5-3.97 0-2.02-1.31-3.39-4.2-4.08z"/></svg>`;
const tollIcon = new L.DivIcon({ html: tollSvg, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });

const createNumberedIcon = (number: number) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z" fill="#3b82f6"/>
      <circle cx="16" cy="16" r="12" fill="white"/>
      <text x="16" y="21" font-size="16" font-weight="bold" text-anchor="middle" fill="#3b82f6">${number}</text>
    </svg>`;
  return new L.DivIcon({
    html: svg,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
  });
};

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

export const RouteMap = ({ orderedCustomers, outboundRoute, returnRoute, userLocation, tollLocations }) => {
  const center: L.LatLngExpression = [-14.235004, -51.92528];

  const routeBounds = outboundRoute && returnRoute
    ? L.latLngBounds([...outboundRoute, ...returnRoute])
    : null;

  return (
    <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
      <ChangeView bounds={routeBounds} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {orderedCustomers && orderedCustomers.map((customer) => (
        <Marker
          key={customer.id}
          position={[customer.lat, customer.lng]}
          icon={createNumberedIcon(customer.sequence)}
        >
          <Tooltip>
            <strong>{customer.name}</strong>
            <br />
            {customer.address}
          </Tooltip>
        </Marker>
      ))}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
        />
      )}
      {tollLocations && tollLocations.map((toll, index) => (
        <Marker
          key={`toll-${index}`}
          position={[toll.lat, toll.lng]}
          icon={tollIcon}
        />
      ))}
      {outboundRoute && <Polyline pathOptions={{ color: 'blue' }} positions={outboundRoute} />}
      {returnRoute && <Polyline pathOptions={{ color: 'red', dashArray: '5, 10' }} positions={returnRoute} />}
    </MapContainer>
  );
};