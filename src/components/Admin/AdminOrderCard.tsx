"use client";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  PhoneCall,
  Truck,
  User,
  UserCheck2,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// status color function
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

// interface
export interface IOrderAdmin {
  _id?: string;
  user: string;
  items: [
    {
      grocery: string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    }
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode?: string;
    fullAddress: string;
    latitude: string;
    longitude: string;
  };
  status: "pending" | "out of delivery" | "delivered";
  assignment?: string;
  assignedDeliveryBoy?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
const AdminOrderCard = ({ order }: { order: IOrderAdmin }) => {
  const [expended, setExpended] = React.useState(false);
  const statusOptions = ["pending", "out of delivery"];
  const [status, setStatus] = useState<string>("pending");
  /*=============== status updated here ================*/
  const updateStatus = async (orderId: string, status: string) => {
    try {
      const result = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        { status }
      );
      setStatus(status);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  /*=========== order status change here========== */
  useEffect(() => {
    setStatus(order?.status);
  }, [order]);
  /*=======called api socket ==========*/
  useEffect(() => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      //status change na hole toString a convert kor_te ha_be
      if (data?.orderId?.toString() == order?._id?.toString()) {
        setStatus(data?.status);
      }
    });
    return () => {
      socket.off("order-status-update");
    };
  }, []);
  return (
    <motion.div
      key={order?._id?.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 hover:shadow-lg border border-gray-100 rounded-2xl transition-all shadow-md mb-4"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-1">
          <p className="text-lg font-bold gap-2 text-primary flex items-center">
            <Package size={20} /> Order #{order?._id?.toString().slice(-6)}
          </p>
          {status !== "delivered" && (
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                order?.isPaid
                  ? "bg-green-100 text-primary border-green-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }`}
            >
              {order?.isPaid ? "Paid" : "Not Paid"}
            </span>
          )}

          <p className="text-gray-500 text-sm">
            {new Date(order?.createdAt || "").toLocaleString()}
          </p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-primary" />
              {order?.address?.fullName}
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <PhoneCall size={16} className="text-primary" />
              {order?.address?.mobile}
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-primary" />
              {order?.address?.fullAddress}
            </p>
          </div>
          {/* payment method */}
          <p className="flex items-center gap-2 text-sm  text-gray-700">
            {order?.paymentMethod === "cod" ? (
              <>
                <Truck size={16} className="text-primary" />
                Cash on Delivery
              </>
            ) : (
              <>
                <CreditCard size={16} className="text-primary" />
                Online Payment
              </>
            )}
          </p>
          {/* ===== Assigned Delivery Boy Info ===== */}
          {order?.assignedDeliveryBoy && (
            <div className="mt-5  mx-auto">
              <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 to-blue-100 p-4 shadow-sm">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                  <UserCheck2 size={22} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                    Assigned Delivery Partner
                  </p>

                  <p className="text-base font-semibold text-gray-800 mt-0.5">
                    {order.assignedDeliveryBoy.name}
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    📞
                    <span className="font-medium">
                      +88 {order.assignedDeliveryBoy.mobile}
                    </span>
                  </p>
                </div>

                {/* Call Button */}
                <a
                  href={`tel:${order.assignedDeliveryBoy.mobile}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 active:scale-95 transition-all"
                >
                  📞 Call
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`px-3 py-1 text-xs capitalize font-semibold border rounded ${statusColor(
              order?.status
            )} `}
          >
            {status}
          </span>
          {status !== "delivered" && (
            <select
              onChange={(e) =>
                updateStatus(order?._id?.toString()!, e.target.value)
              }
              className="mt-2 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue={status}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      {/*  */}
      <div className="border-t pt-3 mt-3 border-gray-200">
        <button
          onClick={() => setExpended(!expended)}
          className="w-full cursor-pointer flex justify-between items-center text-sm font-medium
            text-gray-700 hover:text-primary transition
            "
        >
          <span className="flex items-center">
            <Package size={16} className="text-primary mr-2" />
            {expended ? "Hide Details" : `View Details ${order?.items.length}`}
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
            {status}
          </span>
        </div>
        <div className="text-lg  ">
          Total:
          <span className="text-primary"> ৳{order?.totalAmount}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrderCard;
