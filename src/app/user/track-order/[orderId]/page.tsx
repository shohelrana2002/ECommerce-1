"use client";
import { IOrderAdmin } from "@/components/Admin/AdminOrderCard";
import LiveMap from "@/components/Shared/LiveMap";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
interface ILocation {
  latitude: number;
  longitude: number;
}
const TrackOrderPage = ({ params }: { params: { orderId: string } }) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<IOrderAdmin>();
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const router = useRouter();
  const { orderId } = useParams();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const { data } = await axios.get(`/api/user/get-order/${orderId}`);
        setOrder(data);
        setUserLocation({
          latitude: data?.address?.latitude,
          longitude: data?.address?.longitude,
        });
        setDeliveryBoyLocation({
          latitude: data?.assignedDeliveryBoy?.location?.coordinates[0],
          longitude: data?.assignedDeliveryBoy?.location?.coordinates[1],
        });
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [userData?._id]);
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-emerald-50 via-white to-white">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 hover:bg-emerald-200 transition active:scale-95"
          >
            <ArrowLeft size={18} className="text-emerald-700" />
          </button>

          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-bold text-gray-900">
              Track your order
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
              <span>
                Order #
                <span className="font-extrabold text-emerald-700">
                  {order?._id?.toString().slice(-6)}
                </span>
              </span>

              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-semibold capitalize">
                {order?.status}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* ================= MAP CARD ================= */}
        <section className="rounded-[28px] overflow-hidden bg-white border shadow-xl">
          <div className="px-5 py-4 border-b bg-linear-to-r from-emerald-50 to-white">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              📍 Live delivery location
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Delivery boy is on the way
            </p>
          </div>

          <div className="h-80 sm:h-[420px] md:h-[520px]">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </section>

        {/* ================= ORDER INFO ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* STATUS */}
          <div className="rounded-2xl bg-white border shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1">Order status</p>
            <p className="text-sm font-bold text-emerald-700 capitalize">
              {order?.status}
            </p>
          </div>

          {/* AMOUNT */}
          <div className="rounded-2xl bg-white border shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1">Total payable</p>
            <p className="text-sm font-extrabold text-gray-900">
              ৳ {order?.totalAmount}
            </p>
          </div>
        </section>

        {/* ================= DELIVERY BOY ================= */}
        {order?.assignedDeliveryBoy && (
          <section className="rounded-3xl bg-linear-to-r from-emerald-50 to-white border shadow-md p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-200 flex items-center justify-center text-lg font-bold text-emerald-700">
                {order.assignedDeliveryBoy.name?.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {order.assignedDeliveryBoy.name}
                </p>
                <p className="text-xs text-gray-500">Delivery Partner</p>
                <p className="text-xs font-medium text-gray-700 mt-1">
                  📞 +88{order.assignedDeliveryBoy.mobile}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.assignedDeliveryBoy.mobile}`}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition active:scale-95"
            >
              Call
            </a>
          </section>
        )}
      </main>
    </div>
  );
};

export default TrackOrderPage;
