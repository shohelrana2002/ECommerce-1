"use client";
import { motion } from "motion/react";
import {
  Fish,
  Drumstick,
  Apple,
  Egg,
  Wheat,
  Cookie,
  Wine,
  UserRound,
  Home,
  PackageOpen,
  Baby,
  Pill,
  Paperclip,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const categories = [
  { id: 1, name: "Fish", icon: Fish, color: "bg-sky-300/50" },
  { id: 2, name: "Meat", icon: Drumstick, color: "bg-red-300/50" },
  { id: 3, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-300/50" },
  { id: 4, name: "Dairy & Eggs", icon: Egg, color: "bg-amber-300/50" },
  {
    id: 5,
    name: "Rice, Atta & Grains",
    icon: Wheat,
    color: "bg-yellow-300/50",
  },
  { id: 6, name: "Snacks & Biscuits", icon: Cookie, color: "bg-purple-300/50" },
  { id: 7, name: "Spices & Masalas", icon: Paperclip, color: "bg-red-300/50" },
  { id: 8, name: "Beverages & Drinks", icon: Wine, color: "bg-blue-600/50" },
  { id: 9, name: "Personal Care", icon: UserRound, color: "bg-pink-300/50" },
  {
    id: 10,
    name: "Household Essentials",
    icon: Home,
    color: "bg-slate-300/50",
  },
  {
    id: 11,
    name: "Instant & Packaged Food",
    icon: PackageOpen,
    color: "bg-orange-400",
  },
  { id: 12, name: "Baby & Pet Care", icon: Baby, color: "bg-violet-500" },
  { id: 13, name: "Medicine", icon: Pill, color: "bg-gray-500" },
];
const CategorySlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState<boolean | undefined>();
  const [showRight, setShowRight] = useState<boolean | undefined>();
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction == "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef?.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth <= scrollWidth - 5);
  };
  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", checkScroll);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkScroll();
    return () => removeEventListener("scroll", checkScroll);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className="w-[90%] md:[80%] mx-auto mt-10 relative"
    >
      <motion.h1 className="text-xl md:text-2xl gap-x-4 mb-5 flex text-center items-center mx-auto justify-center font-extrabold text-primary">
        <span>
          <ShoppingCart size={36} />
        </span>{" "}
        Shop By Category
      </motion.h1>
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-300 shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
      )}
      <div
        className="flex overflow-auto gap-6 px-10 pb-4 scrollbar-hide scroll-smooth"
        ref={scrollRef}
      >
        {categories.map((item) => {
          const Icon = item?.icon;
          return (
            <motion.div
              key={item?.id}
              className={`min-h-[150px] md:min-w-[180px] flex flex-col justify-between items-center 
            ${item?.color} shadow-md rounded-2xl hover:shadow-xl transition-all cursor-pointer
            `}
            >
              <div className="flex justify-center items-center flex-col p-4">
                <Icon className="w-10 h-10 text-primary mb-3" />
                <p className="text-center text-sm md:text-base font-semibold text-gray-700">
                  {item.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-300  shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>
      )}
    </motion.div>
  );
};

export default CategorySlider;
