"use client";

import { IOrderAdmin } from "@/components/Admin/AdminOrderCard";
import LiveMap from "@/components/Shared/LiveMap";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, Phone } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IMessage } from "@/models/message.model";
import { Send } from "lucide-react";
import mongoose from "mongoose";
import { motion, AnimatePresence } from "motion/react";
type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};
interface ILocation {
  latitude: number;
  longitude: number;
}

const TrackOrderPage = () => {
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>();
  const { userData } = useSelector((state: RootState) => state.user);

  const [order, setOrder] = useState<IOrderAdmin | null>(null);
  const [userLocation, setUserLocation] = useState<ILocation | null>(null);
  const [deliveryBoyLocation, setDeliveryBoyLocation] =
    useState<ILocation | null>(null);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    if (!orderId) return;

    const getOrder = async () => {
      try {
        const { data } = await axios.get(`/api/user/get-order/${orderId}`);
        setOrder(data);

        if (data?.address?.latitude && data?.address?.longitude) {
          setUserLocation({
            latitude: Number(data.address.longitude), //data base vul tai emn
            longitude: Number(data.address.latitude),
          });
        }

        if (data?.assignedDeliveryBoy?.location?.coordinates) {
          setDeliveryBoyLocation({
            latitude: data.assignedDeliveryBoy.location.coordinates[1],
            longitude: data.assignedDeliveryBoy.location.coordinates[0],
          });
        }
      } catch (error) {
        console.log("Order fetch error Track-Page:", error);
      }
    };

    getOrder();
  }, [userData?._id]);

  /* ================= SOCKET LIVE LOCATION ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = getSocket();
    if (!socket) return;

    socket.on("update-deliveryBoy-location", (data) => {
      setDeliveryBoyLocation({
        latitude: data?.location?.coordinates?.[1] ?? data?.location?.latitude,
        longitude:
          data?.location?.coordinates?.[0] ?? data?.location?.longitude,
      });
    });

    return () => {
      socket.off("update-deliveryBoy-location");
    };
  }, []);
  /*=================== message section here ========= */
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>();
  /*=========== Delivery Socket Connect =============== */
  useEffect((): any => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
    socket.on("send-message", (message) => {
      if (message?.roomId === orderId) {
        setMessages((prev) => [...(prev || []), message]);
      }
    });
    return () => socket.off("send-message");
  }, []);
  /*========= message send function ======== */
  const sendMsg = () => {
    const socket = getSocket();
    if (!socket || !newMessage.trim()) return;
    const message = {
      senderId: userData?._id,
      text: newMessage.trim(),
      roomId: orderId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);

    setNewMessage("");
  };
  /*============ Fetch All Message in delivery Boy =================== */
  useEffect(() => {
    const getAllMessage = async () => {
      try {
        const { data } = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        setMessages(data);
        console.log(data);
      } catch (error) {}
    };
    getAllMessage();
  }, []);
  /*============ Message Scroll Bar Add Here =================== */
  const chatBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  return (
    <div className="min-h-screen bg-linear-to-b from-green-200/70 to-green-50">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 active:scale-95 transition"
          >
            <ArrowLeft size={18} className="text-emerald-700" />
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">
              Track your order
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>
                Order #
                <span className="font-extrabold text-emerald-700 ml-1">
                  {order?._id?.toString()?.slice(-6)}
                </span>
              </span>

              {order?.status && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold capitalize">
                  {order.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* ================= MAP ================= */}
        <section className="rounded-3xl overflow-hidden bg-white border shadow-xl">
          <div className="px-5 py-4 border-b bg-linear-to-r from-emerald-50 to-white">
            <h3 className="text-sm font-semibold text-gray-800">
              📍 Live delivery location
            </h3>
            <p className="text-xs text-gray-500">Delivery partner is moving</p>
          </div>

          <div className="h-80 sm:h-[420px]">
            {userLocation && deliveryBoyLocation ? (
              <LiveMap
                userLocation={userLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Loading map...
              </div>
            )}
          </div>
        </section>
        {order?.assignedDeliveryBoy && (
          <>
            {/* =========== Message Section here ============ */}
            <div className="bg-white rounded-3xl shadow-xl border flex flex-col h-[360px] sm:h-[420px]">
              {/* ================= MESSAGES ================= */}
              <div
                className="flex-1 overflow-y-auto px-3 py-4 space-y-3 chat-scroll"
                ref={chatBoxRef}
              >
                <AnimatePresence>
                  {messages?.map((msg, index) => {
                    const isMe = msg?.senderId == (userData?._id as any);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[60%] px-4 py-2 rounded-2xl text-sm shadow 
              ${
                isMe
                  ? "bg-green-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
                        >
                          <p className="wrap-break-word">{msg.text}</p>

                          <p
                            className={`text-[8px] mt-1 text-right ${
                              isMe ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* ================= INPUT ================= */}
              <div className="flex items-center gap-2 border-t px-3 py-3 bg-white rounded-b-3xl">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                  className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                  onClick={sendMsg}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 active:scale-95 transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================= ORDER INFO ================= */}
        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Order status</p>
            <p className="text-sm font-bold text-emerald-700 capitalize">
              {order?.status}
            </p>
          </div>

          <div className="rounded-2xl bg-white border p-4 shadow-sm">
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
              <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                {order.assignedDeliveryBoy.name?.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {order.assignedDeliveryBoy.name}
                </p>
                <p className="text-xs text-gray-500">Delivery Partner</p>
                <p className="text-xs font-medium text-gray-700 mt-1 flex items-center gap-1">
                  <Phone size={12} /> +88{order.assignedDeliveryBoy.mobile}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.assignedDeliveryBoy.mobile}`}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 active:scale-95 transition"
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
