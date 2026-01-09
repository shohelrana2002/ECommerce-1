"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";

const markIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/9800/9800512.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
type props = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
};
const CheckoutMap = ({ position, setPosition }: props) => {
  const DargAbleMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position, map]);

    return (
      <Marker
        icon={markIcon}
        position={position as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      >
        <Popup>{/* A pretty CSS3 popup. <br /> Easily customizable. */}</Popup>
      </Marker>
    );
  };
  return (
    <MapContainer
      className="w-full h-full"
      center={position as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DargAbleMarker />
    </MapContainer>
  );
};

export default CheckoutMap;
