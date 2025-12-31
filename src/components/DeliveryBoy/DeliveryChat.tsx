import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Send } from "lucide-react";
import mongoose from "mongoose";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};
const DeliveryChat = ({ orderId, deliveryBoyId }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>();
  /*=========== Delivery Socket Connect =============== */
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
  }, []);
  /*========= message send function ======== */
  const sendMsg = () => {
    const socket = getSocket();
    if (!socket || !newMessage.trim()) return;
    const message = {
      senderId: deliveryBoyId,
      text: newMessage.trim(),
      roomId: orderId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);
    socket.on("send-message", (message) => {
      if (message?.roomId === orderId) {
        setMessages((prev) => [...(prev || []), message]);
      }
    });
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
  return (
    <div className="bg-white rounded-3xl shadow-xl border flex flex-col h-[360px] sm:h-[420px]">
      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 chat-scroll">
        <AnimatePresence>
          {messages?.map((msg) => {
            const isMe = msg.senderId === deliveryBoyId;

            return (
              <motion.div
                key={msg?._id?.toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
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
  );
};

export default DeliveryChat;
