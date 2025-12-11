// "use client";
// import { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css"
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// const MapView = ({ position }: { position: [number, number] | null }) => {
//   if (!position) return null;
//   return (
//     <MapContainer
//       className="w-full h-full"
//       center={position as LatLngExpression}
//       zoom={13}
//       scrollWheelZoom={false}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker position={position as LatLngExpression}>
//         <Popup>
//           A pretty CSS3 popup. <br /> Easily customizable.
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default MapView;
