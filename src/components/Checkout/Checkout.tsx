"use client";
import { RootState } from "@/redux/store";
import {
  ArrowBigLeft,
  Building,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";
const markIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/9800/9800512.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const Checkout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { deliveryFee, finalTotal, subTotal, cartData } = useSelector(
    (state: RootState) => state.cart
  );
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // console.log(pos);
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.log("location error", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  }, []);
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ ...prev, fullName: userData.name || "" }));
      setAddress((prev) => ({ ...prev, mobile: userData.mobile || "" }));
    }
  }, [userData]);

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
  // search query input here fu

  const handleSearchQuery = async () => {
    setSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    // search
    const result = await provider.search({ query: searchQuery });
    // console.log(result);

    if (result) {
      setSearchLoading(false);
      setPosition([result[0]?.y, result[0]?.x]);
    }
  };

  // data fetch and set to ui
  useEffect(() => {
    const fetchData = async () => {
      if (!position) return null;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
        );
        setAddress((prev) => ({
          ...prev,
          fullAddress: res.data.display_name,
          city: res.data.address.city || res.data.address.town || "",
          state:
            res.data.address.state_district || res.data.address.state || "",
          pincode: res.data.address.postcode || "",
        }));
        // console.log(res.data);
      } catch (error) {
        console.log("address error ", error);
      }
    };
    fetchData();
  }, [position]);
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // console.log(pos);
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.log("location error", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  };

  // post  data
  const handleCod = async () => {
    if (!position) return null;
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((i) => ({
          grocery: i._id,
          name: i.name,
          price: i.price,
          unit: i.unit,
          image: i.image,
          quantity: i.quantity,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode || "",
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });
      if (result?.status === 201) {
      }
      if (result) {
        router.push("/user/order-success");
      }
    } catch (error) {
      console.log("Order Post error :", error);
    }
  };
  // handle Stripe Online Payment

  const handleOnlineOrder = async () => {
    if (!position) return null;
    try {
      const res = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map((i: any) => ({
          grocery: i._id,
          name: i.name,
          price: i.price,
          unit: i.unit,
          image: i.image,
          quantity: i.quantity,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode || "",
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });
      window.location.href = res?.data?.url;
    } catch (error) {
      console.log(error);
    }
  };
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
        {/* full details here */}
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
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                value={userData?.name || ""}
              />
            </div>
            {/* phone */}
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3 text-primary" />
              <input
                type="text"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gary-50"
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    mobile: e.target.value,
                  }))
                }
                value={userData?.mobile || ""}
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
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
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
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
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
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
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
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value,
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                disabled={searchLoading}
                onClick={handleSearchQuery}
                className="text-white cursor-pointer bg-primary  px-5 rounded-lg hover:bg-green-900 transition-all font-medium"
              >
                {searchLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>
            {/* map  */}
            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border  border-gray-200 shadow-inner">
              {position && (
                <>
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
                  <motion.button
                    onClick={handleCurrentLocation}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer absolute bottom-4 right-4 bg-primary text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex justify-center items-center z-999"
                  >
                    <LocateFixed size={22} />
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>
        {/* payment method */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-primary " /> Payment Method
          </h2>
          <div className="space-y-4 mb-6 ">
            <button
              onClick={() => setPaymentMethod("online")}
              className={`flex cursor-pointer items-center gap-3 w-full border rounded-lg p-3 transition-all 
              ${
                paymentMethod === "online"
                  ? "border-primary bg-green-50 shadow-sm"
                  : "hover:bg-gray-50"
              }
              `}
            >
              <CreditCardIcon className="text-primary " />
              <span className="font-medium text-gray-700 ">
                Pay Online(stripe)
              </span>{" "}
            </button>
            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex cursor-pointer items-center gap-3 w-full border rounded-lg p-3 transition-all 
              ${
                paymentMethod === "cod"
                  ? "border-primary bg-green-50 shadow-sm"
                  : "hover:bg-gray-50"
              }
              `}
            >
              <Truck className="text-primary " />
              <span className="font-medium text-gray-700 ">
                Cash On Delivery(cod)
              </span>{" "}
            </button>
          </div>
          {/* summary */}
          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-bas">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-bold text-primary"> ৳{subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery Fee:</span>
              <span className="font-bold text-primary">৳{deliveryFee}</span>
            </div>
            <div className="flex font-bold text-lg border-t pt-2 justify-between">
              <span className="">Final Total:</span>
              <span className=" text-primary">৳{finalTotal}</span>
            </div>
            <motion.button
              onClick={() => {
                if (paymentMethod === "cod") {
                  handleCod();
                } else {
                  // alert("online Payment");
                  handleOnlineOrder();
                }
              }}
              whileTap={{ scale: 0.96 }}
              className="text-white cursor-pointer  bg-primary  p-2 w-full mx-auto rounded-lg hover:bg-green-900 transition-all font-medium"
            >
              {paymentMethod === "cod" ? " Place Order" : "Pay & Place Order"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
