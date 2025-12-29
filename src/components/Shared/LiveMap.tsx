import React from "react";
interface ILocation {
  latitude: number;
  longitude: number;
}
interface IProps {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
const LiveMap = ({ userLocation, deliveryBoyLocation }: IProps) => {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
  });
  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9384/9384815.png",
    iconSize: [45, 45],
  });
  const linePositions =
    deliveryBoyLocation && userLocation
      ? [
          [userLocation?.latitude, userLocation?.longitude],
          [deliveryBoyLocation?.latitude, deliveryBoyLocation?.longitude],
        ]
      : [];
  const center = [userLocation?.latitude, userLocation?.longitude];
  return (
    <div className="w-full h-[500px] rounded-xl  overflow-hidden relative">
      <MapContainer
        className="w-full h-full"
        center={center as LatLngExpression | undefined}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[userLocation?.latitude, userLocation?.longitude]}
          icon={userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>

        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation?.latitude,
              deliveryBoyLocation?.longitude,
            ]}
            icon={deliveryBoyIcon}
          >
            {" "}
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        <Polyline color="green" positions={linePositions as any} />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
