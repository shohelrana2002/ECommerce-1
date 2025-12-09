"use client";
import { IGrocery } from "@/models/grocery.model";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-white cursor-pointer rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col relative"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden group">
        <Image
          src={item?.image || ""}
          alt={item?.name}
          fill
          sizes="(max-width:768px) 100vw, 25vw"
          className="object-contain p-4 z-10 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-3 ">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
          {item?.category}
        </p>
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {item?.name}
        </h3>
        <div className="flex justify-between items-center ">
          <span className="text-sm text-gray-500">{item?.unit}</span>
          <span className="text-lg font-bold text-gray-900">
            ৳ {item?.price}
          </span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="mt-2 flex cursor-pointer  items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-xl shadow-md transition-all duration-200"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
