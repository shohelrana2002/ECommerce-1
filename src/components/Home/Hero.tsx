"use client";
import { AnimatePresence, motion } from "motion/react";
import { Apple, Carrot, Beef, Fish, Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getSocket } from "@/lib/socket";

export const groceryCategories = [
  {
    id: 1,
    btnText: "Order Now",
    title: "Fresh Fruits",
    icon: (
      <Apple className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg" />
    ),
    color: "#16a34a",
    desc: "Premium hand-picked fruits, delivered fresh and fast to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1498579397066-22750a3cb424?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: 2,
    btnText: "Order Now",
    title: "Fresh Vegetables",
    icon: (
      <Carrot className="w-20 h-20 sm:w-28 sm:h-28 text-orange-400 drop-shadow-lg" />
    ),
    color: "#f97316",
    desc: "Crisp and nutrient-rich vegetables, sourced daily for your healthy meals.",
    image:
      "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: 3,
    btnText: "Order Now",
    title: "Meat & Chicken",
    icon: (
      <Beef className="w-20 h-20 sm:w-28 sm:h-28 text-red-600 drop-shadow-lg" />
    ),
    color: "#dc2626",
    desc: "Hygienic, farm-fresh meat and chicken, ready for your favorite recipes.",
    image:
      "https://images.unsplash.com/photo-1723893905879-0e309c2a8e06?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: 4,
    btnText: "Order Now",
    title: "Fish & Seafood",
    icon: (
      <Fish className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />
    ),
    color: "#0284c7",
    desc: "Fresh river and sea catch, packed carefully and delivered promptly.",
    image:
      "https://images.unsplash.com/photo-1638189685037-594c346a8366?q=80&w=774&auto=format&fit=crop",
  },
  {
    id: 5,
    btnText: "Order Now",
    title: "Snacks & Cookies",
    icon: (
      <Cookie className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-500 drop-shadow-lg" />
    ),
    color: "#ca8a04",
    desc: "Delicious snacks and cookies for every craving, delivered right to you.",
    image:
      "https://images.unsplash.com/photo-1572660622243-53b221c6a842?q=80&w=870&auto=format&fit=crop",
  },
];

export default function Hero() {
  useEffect(() => {
    let socket = getSocket();
  }, []);

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const time = setInterval(() => {
      setCurrent((prev) => (prev + 1) % groceryCategories.length);
    }, 4000);
    return () => clearInterval(time);
  }, []);
  return (
    <div className="mt-32 relative w-[98%] mx-auto h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.4,
          }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          <Image
            className=" object-cover  items-center"
            src={groceryCategories[current]?.image}
            fill
            property="high"
            alt="slide"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
        <motion.div
          className="flex flex-col items-center justify-center gap-3 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-md px-6 rounded-full shadow-lg">
            <span> {groceryCategories[current]?.icon}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-5xl font-extrabold text-white"
          >
            {groceryCategories[current]?.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-xl text-white/80"
          >
            {groceryCategories[current]?.desc}
          </motion.p>

          {/* Button */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=" px-6 py-2 bg-primary text-white rounded-full font-semibold 
      hover:bg-green-700 transition-colors duration-300 shadow-md"
          >
            {groceryCategories[current]?.btnText || "Shop Now"}
          </motion.button>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {groceryCategories.map((_, index) => (
          <button
            key={index}
            className={`w-3 rounded-full h-3 transition-all ${
              index === current ? "bg-white w-6" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
