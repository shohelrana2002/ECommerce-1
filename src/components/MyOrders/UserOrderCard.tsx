"use client";
import { getSocket } from "@/lib/socket";

import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
  UserCheck2,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IOrderAdmin } from "../Admin/AdminOrderCard";

const UserOrderCard = ({ order }: { order: IOrderAdmin }) => {
  const router = useRouter();
  const [expended, setExpended] = React.useState(false);
  const [status, setStatus] = useState(order?.status);
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
  /*=======called api socket ==========*/
  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      //status change na hole toString a convert kor_te ha_be
      if (data?.orderId?.toString() == order?._id?.toString()) {
        setStatus(data?.status);
      }
    });
    return () => socket.off("order-status-update");
  }, []);

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
          {status !== "delivered" && (
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                order?.isPaid
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-red-100 text-red-800 border-red-300"
              }`}
            >
              {order?.isPaid ? "Paid" : "Unpaid"}
            </span>
          )}

          <span
            className={`px-3 py-1 capitalize text-xs font-semibold border rounded ${statusColor(
              status
            )} `}
          >
            {status}
          </span>
        </div>
      </div>

      {/* content  Here */}
      {status !== "delivered" && (
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
          {/* ===== Assigned Delivery Boy Info ===== */}
          {order?.assignedDeliveryBoy && (
            <>
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
              {/* Track Order */}
              <button
                onClick={() =>
                  router.push(`/user/track-order/${order?._id?.toString()}`)
                }
                className="inline-flex w-full items-center justify-center rounded-xl border border-primary bg-primary hover:bg-primary/96 cursor-pointer transition-all duration-300  px-4 py-2 gap-x-3 text-xs font-bold text-white  active:scale-95"
              >
                📍 Track Order <Truck />
              </button>
            </>
          )}
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
                {status}
              </span>
            </div>
            <div className="text-lg  ">
              Total:
              <span className="text-primary"> ৳{order?.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserOrderCard;
