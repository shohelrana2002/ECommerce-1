import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Loader, Send, Sparkle } from "lucide-react";
import mongoose from "mongoose";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};
const DeliveryChat = ({ orderId, deliveryBoyId }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>();
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
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
      senderId: deliveryBoyId,
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
  /*============ Message Scroll Bar Add Here =================== */
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
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
  /*==================== Delivery Chat AI Api  CAll Here ============= */
  const getSuggestion = async () => {
    setLoading(true);
    try {
      const lastMessage = messages
        ?.filter((m) => m.senderId !== deliveryBoyId)
        ?.at(-1);
      const { data } = await axios.post("/api/chat/ai-suggestions", {
        message: lastMessage?.text,
        role: "deliveryBoy",
      });
      setSuggestions(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-3xl shadow-xl border flex flex-col h-[360px] sm:h-[420px]">
      {/* ============== AI Suggestions Header ============== */}
      <div className="flex items-center p-2 justify-between mb-4">
        {/* Left title */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Sparkle className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            Quick Responses
          </span>
        </div>
        <motion.button
          disabled={loading}
          onClick={getSuggestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 18px rgba(16, 185, 129, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className=" relative overflow-hidden cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-emerald-500 to-green-600 text-white text-xs font-bold shadow-md "
        >
          {/* ✨ Shimmer animation */}
          <motion.span
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear",
            }}
          />

          {/* ✨ Icon pulse */}
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <Sparkle className="h-3.5 w-3.5" />
          </motion.span>

          <span className="relative z-10">
            {loading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              "AI Suggest"
            )}
          </span>
        </motion.button>
      </div>
      {/* ========= AI Suggestions Message ========= */}
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions?.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{
              scale: 1.01,
              backgroundColor: "#10b981",
              color: "#ffffff",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="
        px-3 py-1.5   rounded-full text-xs font-semibold   border border-emerald-200  bg-emerald-50 text-emerald-700  cursor-pointer shadow-sm hover:shadow-md transition "
            onClick={() => setNewMessage(s)}
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* ================= MESSAGES ================= */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3 chat-scroll"
        ref={chatBoxRef}
      >
        <AnimatePresence>
          {messages?.map((msg, index) => {
            const isMe = msg.senderId === deliveryBoyId;

            return (
              <motion.div
                key={msg?._id?.toString() || index}
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
