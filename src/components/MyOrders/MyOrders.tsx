"use client";
import { IOrder } from "@/models/order.model";
import axios from "axios";
import { ArrowLeft, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import UserOrderCard from "./UserOrderCard";
const MyOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get("/api/user/my-orders");
        setLoading(false);
        setOrders(res?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, []);

  if (loading)
    return (
      <div className="min-h-[50vh] flex justify-center items-center text-gray-600">
        Loading.......
      </div>
    );
  return (
    <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
        <div className="fixed top-0 w-full left-0 backdrop-blur-lg bg-white/70  shadow-sm border-b z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
            >
              <ArrowLeft size={24} className="text-primary" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>
        {orders?.length === 0 ? (
          <div className="text-center flex flex-col justify-center items-center text-gray-500 py-10">
            <span>
              <Package size={70} className="text-primary mb-5" />
            </span>
            <h2 className="text-xl ">No Orders Found</h2>
            <p> No data available right now.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {orders?.map((order: IOrder, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={index}
              >
                <UserOrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
