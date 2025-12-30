"use client";

import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiveMap from "../Shared/LiveMap";
interface ILocation {
  latitude: number;
  longitude: number;
}
const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  /*=============assignments fetch here======== */
  const assignmentsFetch = async () => {
    try {
      const { data } = await axios.get("/api/delivery/get-assignments");
      console.log(data);
      setAssignments(data);
    } catch (error) {
      console.log(error);
    }
  };

  /*==============location update============= */
  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator?.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos?.coords?.latitude;
        const lon = pos?.coords?.longitude;
        setDeliveryBoyLocation({
          longitude: lon, // dat base a vul neo jon error
          latitude: lat,
        });
        socket.emit("update-location", {
          userId: userData?._id,
          longitude: lon,
          latitude: lat, // dat base a vul neo jon error
        });
      },
      (error: any) => {
        console.error("Geolocation error:", error.message);
      },
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);
  /*==============socket api call here============= */
  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      // setAssignments((prev) => [...prev, deliveryAssignment]);
      setAssignments((prev) =>
        Array.isArray(prev)
          ? [...prev, deliveryAssignment]
          : [deliveryAssignment]
      );
    });
    return () => socket.off("new-assignment");
  }, []);
  /*================ accepted order handle here=============== */
  const handleAccepted = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept-assignment`
      );
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  /*================ Current Delivery Get Here */
  const fetchCurrentOrder = async () => {
    try {
      const { data } = await axios.get("/api/delivery/current-order");
      if (data?.active) {
        // console.log(data?.assignment?.order?.address);
        setActiveOrder(data?.assignment);
        setUserLocation({
          latitude: data?.assignment?.order?.address?.longitude,
          longitude: data?.assignment?.order?.address?.latitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    assignmentsFetch();
    fetchCurrentOrder();
  }, [userData]);
  /*================== location or curet delivery tha_kle eta dek_kh_be========== */
  if (activeOrder && userLocation) {
    return (
      <div className="min-h-screen mt-28 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl text-primary mb-2 font-semibold ">
            Active Delivery
          </h1>
          <p className="text-xs">
            <b>Active Order:</b>
            <span className="text-primary font-semibold">
              #{activeOrder?.order?._id.slice(-6)}
            </span>
          </p>
          {/* ============= map sho Now =========== */}
          <div className="rounded-xl  border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </div>
      </div>
    );
  }
  /*================== location or curet delivery na  tha_kle eta dek_kh_be========== */

  return (
    <div className="mt-24 w-full min-h-screen  bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Delivery Assignments </h2>
        {assignments?.length > 0 ? (
          assignments.map((data, index) => (
            <div
              className="p-5 bg-white rounded-xl shadow mb-4 border"
              key={index}
            >
              <p>
                <b>OrderId:</b>
                <span className="text-primary font-extrabold">
                  #{data?.order?._id.slice(-8)}
                </span>
              </p>
              <p className="flex items-center">
                <b>Address:</b>
                <MapPin size={16} className="text-primary font-bold" />
                {data?.order?.address?.fullAddress}
              </p>
              <div className="flex justify-center gap-x-4 mt-4">
                <button
                  onClick={() => handleAccepted(data?._id)}
                  className="w-full px-6 py-2 bg-primary text-white rounded-full font-semibold 
      hover:bg-green-500 cursor-pointer transition-colors duration-300 shadow-md"
                >
                  Accept
                </button>
                <button
                  className="w-full px-6 py-2 cursor-pointer bg-red-800 text-white rounded-full font-semibold 
      hover:bg-red-700 transition-colors duration-300 shadow-md"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <>No Assignment Data</>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
