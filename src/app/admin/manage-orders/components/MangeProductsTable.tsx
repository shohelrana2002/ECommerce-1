"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { LeafIcon } from "lucide-react";
import AdminOrderCard, { IOrderAdmin } from "@/components/Admin/AdminOrderCard";
import { getSocket } from "@/lib/socket";
// import { IOrder } from "@/models/order.model";
const MangeProductsTable = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrderAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/admin/manage-orders");
        setLoading(false);
        console.log(res.data);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  /*=================== socket api call ===============*/
  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-order", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });
    return () => socket.off("new-order");
  }, []);
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-600">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm">Loading, please wait...</p>
      </div>
    );

  if (orders.length === 0) {
    return <div className="text-center py-10">No Orders Found</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-linear-to-br mt-16 from-green-100 to-green-50 ">
      {/* heading or Back Button */}
      <div className="fixed top-0 w-full left-0 backdrop-blur-lg shadow-sm border-b z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
          <motion.button
            initial={{ x: -40 }}
            animate={{ x: 0 }}
            onClick={() => router.push("/")}
            className="absolute t-2 left-8 flex items-center gap-2 text-green-700 
            hover:text-green-900 font-semibold bg-green-100 px-4 py-2 
            rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <LeafIcon size={20} />
            Back Home
          </motion.button>
          <h1 className="text-xl font-bold text-gray-800">Mange Orders</h1>
        </div>
      </div>
      {/* card here */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        <div className="space-y-6">
          {orders?.map((order, index) => (
            <AdminOrderCard key={index} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MangeProductsTable;
