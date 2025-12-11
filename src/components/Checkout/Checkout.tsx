"use client";
import { RootState } from "@/redux/store";
import {
  ArrowBigLeft,
  Building,
  Home,
  MapPin,
  Navigation,
  Phone,
  Search,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

const markIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/9800/9800512.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const Checkout = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
  const [position, setPosition] = useState<[number, number] | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log(pos);
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      });
    }
  }, []);
  useEffect(() => {
    if (userData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress((prev) => ({ ...prev, fullName: userData.name || "" }));
      setAddress((prev) => ({ ...prev, mobile: userData.mobile || "" }));
    }
  }, [userData]);
  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative ">
      <motion.button
        onClick={() => router.push("/user/cart")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="absolute cursor-pointer left-0 top-2 flex items-center gap-2 text-primary hover:text-green-800 font-semibold"
      >
        <ArrowBigLeft />
        <span className="hidden sm:inline"> Back To Cart</span>
      </motion.button>
      <motion.h2
        initial={{ opacity: 0, y: -7 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-10"
      >
        Checkout
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -7 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800  mb-4 flex items-center ga2">
            <MapPin className="text-primary" /> Delivery Address
          </h2>
          <div className="space-y-4">
            {/* full name */}
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-primary" />
              <input
                type="text"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gary-50"
                onChange={() =>
                  setAddress((prev) => ({
                    ...prev,
                    fullName: address.fullName,
                  }))
                }
                value={userData?.name}
              />
            </div>
            {/* phone */}
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3 text-primary" />
              <input
                type="text"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gary-50"
                onChange={() =>
                  setAddress((prev) => ({
                    ...prev,
                    fullName: address.mobile,
                  }))
                }
                value={userData?.mobile}
              />
            </div>
            {/* full address */}
            <div className="relative">
              <Home size={18} className="absolute left-3 top-3 text-primary" />
              <input
                type="text"
                value={address.fullAddress}
                placeholder="Full Address"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gary-50"
                onChange={() =>
                  setAddress((prev) => ({
                    ...prev,
                    fullName: address.fullAddress,
                  }))
                }
              />
            </div>
            {/* 3 input */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  size={18}
                  className="absolute left-3 top-3 text-primary"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gary-50"
                  onChange={() =>
                    setAddress((prev) => ({
                      ...prev,
                      fullName: address.city,
                    }))
                  }
                />
              </div>
              <div className="relative">
                <Navigation
                  size={18}
                  className="absolute left-3 top-3 text-primary"
                />
                <input
                  type="text"
                  value={address.state}
                  placeholder="State "
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gary-50"
                  onChange={() =>
                    setAddress((prev) => ({
                      ...prev,
                      fullName: address.state,
                    }))
                  }
                />
              </div>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-primary"
                />
                <input
                  type="text"
                  value={address.pincode}
                  placeholder="Pincode"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gary-50"
                  onChange={() =>
                    setAddress((prev) => ({
                      ...prev,
                      fullName: address.pincode,
                    }))
                  }
                />
              </div>
            </div>
            {/* search bar */}
            <div className="flex gap-2  mt-3">
              <input
                type="text"
                className="flex-1  border rounded-lg p-3  text-sm focus:ring-2 focus:ring-green-500"
                placeholder="search your address"
              />
              <button className="text-white bg-primary  px-5 rounded-lg hover:bg-green-900 transition-all font-medium">
                Search
              </button>
            </div>
            {/* map  */}
            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border  border-gray-200 shadow-inner">
              {position && (
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
                  <Marker
                    icon={markIcon}
                    position={position as LatLngExpression}
                  >
                    <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
