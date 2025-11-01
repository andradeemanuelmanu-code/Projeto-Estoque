import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useEffect } from "react";

// Define custom icons using inline SVG
const customerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
const supplierSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22c55e" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

const customerIcon = new L.DivIcon({
  html: customerSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const supplierIcon = new L.DivIcon({
  html: supplierSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Helper component to change map view when a location is selected
const ChangeView = ({ center, zoom }: { center: L.LatLngExpression | null, zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1,
      });
    }
  }, [center, zoom, map]);
  return null;
};

export const MapComponent = ({ locations, selectedLocation, onMarkerClick }) => {
  const center: L.LatLngExpression = [-14.235004, -51.92528];
  const selectedPosition = selectedLocation ? [selectedLocation.lat, selectedLocation.lng] as L.LatLngExpression : null;

  return (
    <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
      <ChangeView center={selectedPosition} zoom={14} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={location.type === 'customer' ? customerIcon : supplierIcon}
            eventHandlers={{
              click: () => {
                onMarkerClick(location);
              },
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};