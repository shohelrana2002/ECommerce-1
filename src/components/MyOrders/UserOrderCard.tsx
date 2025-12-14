"use client";
import { IOrder } from "@/models/order.model";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

const UserOrderCard = ({ order }: { order: IOrder }) => {
  const [expended, setExpended] = React.useState(false);
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
        <div className="border-t pt-3 border-gray-200">
          <button
            onClick={() => setExpended(!expended)}
            className="w-full cursor-pointer flex justify-between items-center text-sm font-medium
            text-gray-700 hover:text-primary transition
            "
          >
            <span className="flex items-center">
              <Package size={16} className="text-primary mr-2" />
              {expended
                ? "Hide Details"
                : `View Details ${order?.items.length}`}
            </span>
            {expended ? (
              <ChevronUp size={20} className="text-primary" />
            ) : (
              <ChevronDown size={20} className="text-primary " />
            )}
          </button>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expended ? "auto" : 0,
              opacity: expended ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {expended && (
              <div className="mt-3 space-y-4 ">
                {order?.items.map((item, index) => (
                  <div
                    className="flex items-center justify-between bg-gray-50 rounded-xl  px-3 py-2 hover:bg-gray-100 transition gap-4"
                    key={index}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item?.quantity} x {item?.unit}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold  text-gray-800">
                        ৳ {Number(item?.price) * item?.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
        <div className="flex justify-between items-center font-semibold pt-3 border-t border-gray-800">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16} className="text-primary" />
            <span className="text-primary font-semibold capitalize">
              {order?.status}
            </span>
          </div>
          <div className="text-lg  ">
            Total:
            <span className="text-primary"> ৳{order?.totalAmount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrderCard;
