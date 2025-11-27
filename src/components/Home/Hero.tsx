"use client";
import { AnimatePresence, motion } from "motion/react";
import {
  Apple,
  Carrot,
  Beef,
  Fish,
  Cookie,
  Milk,
  Sandwich,
  Candy,
  Coffee,
  Soup,
  Wheat,
  Salad,
  Popcorn,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

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
  //   {
  //     id: 6,
  //     btnText: "Order Now",
  //     title: "Dairy & Milk",
  //     icon: (
  //       <Milk className="w-20 h-20 sm:w-28 sm:h-28 text-blue-300 drop-shadow-lg" />
  //     ),
  //     color: "#0ea5e9",
  //     desc: "Pure dairy products including milk, butter, and cheese — always fresh.",
  //     image:
  //       "https://images.unsplash.com/photo-1589923188900-1c0c04f61103?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 7,
  //     btnText: "Order Now",
  //     title: "Breakfast Foods",
  //     icon: (
  //       <Sandwich className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-300 drop-shadow-lg" />
  //     ),
  //     color: "#facc15",
  //     desc: "Start your day right with wholesome breakfast items delivered fast.",
  //     image:
  //       "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 8,
  //     btnText: "Order Now",
  //     title: "Chocolates & Candy",
  //     icon: (
  //       <Candy className="w-20 h-20 sm:w-28 sm:h-28 text-pink-500 drop-shadow-lg" />
  //     ),
  //     color: "#a21caf",
  //     desc: "Premium chocolates and candies to satisfy your sweet tooth quickly.",
  //     image:
  //       "https://images.unsplash.com/photo-1613573421373-6aa2cde1dcd8?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 9,
  //     btnText: "Order Now",
  //     title: "Tea & Coffee",
  //     icon: (
  //       <Coffee className="w-20 h-20 sm:w-28 sm:h-28 text-brown-400 drop-shadow-lg" />
  //     ),
  //     color: "#7c3aed",
  //     desc: "Quality tea and coffee selections for a refreshing start to your day.",
  //     image:
  //       "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 10,
  //     btnText: "Order Now",
  //     title: "Soups & Instant Food",
  //     icon: (
  //       <Soup className="w-20 h-20 sm:w-28 sm:h-28 text-red-400 drop-shadow-lg" />
  //     ),
  //     color: "#db2777",
  //     desc: "Quick and tasty instant meals to keep you nourished on busy days.",
  //     image:
  //       "https://images.unsplash.com/photo-1600691001798-4f2c3d1b7d6f?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 11,
  //     btnText: "Order Now",
  //     title: "Rice & Wheat",
  //     icon: (
  //       <Wheat className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-600 drop-shadow-lg" />
  //     ),
  //     color: "#b45309",
  //     desc: "High-quality rice and wheat staples delivered fresh at the best prices.",
  //     image:
  //       "https://images.unsplash.com/photo-1589308078057-74bbfbf173f2?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 12,
  //     btnText: "Order Now",
  //     title: "Salad Items",
  //     icon: (
  //       <Salad className="w-20 h-20 sm:w-28 sm:h-28 text-green-500 drop-shadow-lg" />
  //     ),
  //     color: "#15803d",
  //     desc: "Fresh and crisp salad ingredients for a healthy lifestyle.",
  //     image:
  //       "https://images.unsplash.com/photo-1604908177520-2de1c1d5e94b?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 13,
  //     btnText: "Order Now",
  //     title: "Popcorn & Chips",
  //     icon: (
  //       <Popcorn className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg" />
  //     ),
  //     color: "#d97706",
  //     desc: "Crispy, flavorful snacks to enjoy anytime, delivered fast.",
  //     image:
  //       "https://images.unsplash.com/photo-1612197527400-5f51519adfa6?q=80&w=870&auto=format&fit=crop",
  //   },
  //   {
  //     id: 14,
  //     btnText: "Order Now",
  //     title: "Kitchen Essentials",
  //     icon: (
  //       <Utensils className="w-20 h-20 sm:w-28 sm:h-28 text-gray-700 drop-shadow-lg" />
  //     ),
  //     color: "#4b5563",
  //     desc: "All your daily kitchen necessities, delivered promptly and reliably.",
  //     image:
  //       "https://images.unsplash.com/photo-1582474767739-ff3c3c3e0f3c?q=80&w=870&auto=format&fit=crop",
  //   },
];

export default function Hero() {
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
