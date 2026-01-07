"use client";

import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Loader, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LiveMap from "../Shared/LiveMap";
import DeliveryChat from "./DeliveryChat";
import mongoose from "mongoose";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
interface ILocation {
  latitude: number;
  longitude: number;
}
const DeliveryBoyDashboard = ({ earning }: { earning: number }) => {
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
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSendLoading, setSendOtpLoading] = useState(false);
  const [error, setError] = useState("");
  /*=============assignments fetch here======== */
  const assignmentsFetch = async () => {
    try {
      const { data } = await axios.get("/api/delivery/get-assignments");
      // console.log(data);
      // setAssignments(data);
      setAssignments(Array.isArray(data?.assignments) ? data.assignments : []);
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
      await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
      fetchCurrentOrder();
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
      // console.log(error);
    }
  };

  /*=============== fetch current location dil_eo hab_e na dil_e hab_e ========= */
  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location?.coordinates[1],
        longitude: location?.coordinates[0],
      });
    });
    return () => {
      socket.off("update-deliveryBoy-location");
    };
  }, []);

  useEffect(() => {
    assignmentsFetch();
    fetchCurrentOrder();
  }, [userData]);

  /*=========== Send Otp Call here======== */

  const otpSend = async () => {
    setSendOtpLoading(true);
    try {
      const data = await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder?.order?._id,
      });
      // console.log(data);
      if (data?.status === 200 || data?.status === 201) {
        setShowOtpBox(true);
        setSendOtpLoading(false);
        toast.success(data?.data?.message || "Delivery Otp Send Success");
      }
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false);
    }
  };
  const verifyOtp = async () => {
    setSendOtpLoading(true);
    try {
      const data = await axios.post("/api/delivery/otp/verify", {
        orderId: activeOrder?.order?._id,
        otp,
      });
      if (data?.status === 200 || data?.status === 201) {
        setError("");
        setActiveOrder(null);
        setAssignments((prev) =>
          prev.filter((a) => a?.order?._id !== activeOrder?.order?._id)
        );
        setSendOtpLoading(false);
        await fetchCurrentOrder();
        toast.success(data?.data?.message || "Verify Otp Success");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to Verify OTP");
      setSendOtpLoading(false);
    }
  };

  /*========== Shop Graph ===== */
  if (!activeOrder && Array.isArray(assignments) && assignments.length === 0) {
    const todayEarning = [{ name: "Today", earning, deliveries: earning / 40 }];

    return (
      <div className="min-h-screen mt-22  flex items-center justify-center bg-linear-to-br from-green-50 via-white to-green-100 px-4">
        <div className="w-full max-w-lg">
          {/* Empty State */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              🚛
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800">
              No Active Deliveries
            </h3>
            <p className="text-gray-500 mt-1">
              Stay online to receive new orders
            </p>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-2xl border shadow-lg p-5 sm:p-6">
            <h2 className="text-center text-lg font-semibold text-green-700 mb-4">
              📊 Today&apos;s Performance
            </h2>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={todayEarning}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="earning"
                    name="Earning (৳)"
                    fill="#16A34A"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="deliveries"
                    name="Deliveries"
                    fill="#2563EB"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border shadow-md rounded-2xl p-5">
                {/* Earning */}
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-500">Today’s Earning</p>
                  <p className="text-primary font-extrabold text-2xl md:text-3xl">
                    ৳ {earning || 0}
                  </p>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => window.location.reload()}
                  className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-green-600 active:scale-95  transition-all shadow-md"
                >
                  🔄 Refresh Earning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <DeliveryChat
            orderId={activeOrder?.order?._id}
            deliveryBoyId={userData?._id as unknown as mongoose.Types.ObjectId}
          />
          {/* ========= Delivery Bookmarked Button ======= */}
          <div className="mt-6 bg-white text-xl rounded-lg mb-4  border shadow p-6">
            {!activeOrder?.order?.deliveryOtpVerification && !showOtpBox && (
              <button
                disabled={otpSendLoading}
                onClick={otpSend}
                className="w-full mt-1 flex justify-center items-center p-2 mx-auto text-center hover:bg-primary/90 cursor-pointer  bg-primary  text-white rounded-2xl"
              >
                {otpSendLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Mark as Delivered"
                )}
              </button>
            )}
            {/* ========== otp input filed ====== */}
            {showOtpBox && (
              <div className="mt-2">
                <input
                  type="text"
                  className="w-full py-3  border rounded-lg text-center"
                  placeholder="Enter otp"
                  minLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                {error && <p className="text-red-600">{error}</p>}
                <button
                  disabled={otpSendLoading}
                  onClick={verifyOtp}
                  className="w-full flex mt-2 justify-center items-center p-2 mx-auto text-center hover:bg-primary/90 cursor-pointer  bg-primary  text-white rounded-2xl"
                >
                  {otpSendLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            )}
            {activeOrder?.order?.deliveryOtpVerification && (
              <div className="text-center text-primary font-bold">Delivery</div>
            )}
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

        {assignments?.map((data, index) => (
          <div
            className="p-5 bg-white  rounded-xl shadow mb-4 border"
            key={index}
          >
            <p>
              <b>OrderId:</b>
              <span className="text-primary font-extrabold">
                #{data?.order?._id?.slice(-8)}
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
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
