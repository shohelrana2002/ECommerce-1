"use client";
import { IOrder } from "@/models/order.model";
import { CreditCard, MapPin, Truck } from "lucide-react";
import { motion } from "motion/react";

const UserOrderCard = ({ order }: { order: IOrder }) => {
  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "out for delivery":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3  border-b border-gray-100  px-5 py-4 bg-linear-t-r from-green-50 to-white">
        <div>
          <p className="text-lg font-semibold text-gray-800 ">
            Order:
            <span className="text-primary font-bold">
              #{order?._id?.toString().slice(-6)}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order?.createdAt || "").toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap  items-center gap-2">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              order?.isPaid
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            {order?.isPaid ? "Paid" : "Unpaid"}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold border rounded ${statusColor(
              order?.status
            )} `}
          >
            {order?.status}
          </span>
        </div>
      </div>

      {/* content  Here */}
      <div className="p-5 space-y-4">
        {order?.paymentMethod === "cod" ? (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16} className="text-primary" />

            <span className="text-gray-900 font-semibold">
              Cash on Delivery
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <CreditCard size={16} className="text-primary" />

            <span>Online Payment</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin size={16} className="text-primary" />
          <span className="truncate"> {order?.address.fullAddress}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrderCard;
