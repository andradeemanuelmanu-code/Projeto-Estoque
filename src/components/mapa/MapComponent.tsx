import { GoogleMap, MarkerClustererF, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useMemo } from "react";

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -14.235004,
  lng: -51.92528,
};

const customerIcon = {
  url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
};

const supplierIcon = {
  url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22c55e" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
};

export const MapComponent = ({ locations, selectedLocation, onMarkerClick }) => {
  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel: true,
    zoomControl: true,
  }), []);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={4}
      options={mapOptions}
    >
      <MarkerClustererF>
        {(clusterer) =>
          locations.map((location) => (
            <MarkerF
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              clusterer={clusterer}
              onClick={() => onMarkerClick(location)}
              icon={location.type === 'customer' ? customerIcon : supplierIcon}
            />
          ))
        }
      </MarkerClustererF>

      {selectedLocation && (
        <InfoWindowF
          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onCloseClick={() => onMarkerClick(null)}
        >
          <div>
            <h4 className="font-bold">{selectedLocation.name}</h4>
            <p>{selectedLocation.address}</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};