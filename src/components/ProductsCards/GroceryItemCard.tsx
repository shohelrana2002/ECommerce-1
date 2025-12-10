"use client";
import { TUnit } from "@/models/grocery.model";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";
import mongoose from "mongoose";
interface IGrocery {
  _id: mongoose.Types.ObjectId;
  email?: string;
  name: string;
  description?: string;
  category: string;
  price: string;
  stock: string;
  unit: TUnit;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i?._id === item?._id);
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

        {cartItem ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex justify-center items-center bg-green-50 border border-green-200 rounded-full  py-2 px-4 gap-4"
          >
            <button
              onClick={() => dispatch(increaseQuantity(item?._id))}
              className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-full bg-green-100n hover:bg-green-200 transition-all"
            >
              <Plus size={16} className="text-primary" />
            </button>
            <span className="text-sm font-extrabold text-primary">
              {cartItem?.quantity}
            </span>
            <button
              onClick={() => dispatch(decreaseQuantity(item?._id))}
              className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-full bg-green-100n hover:bg-green-200 transition-all"
            >
              <Minus size={16} className="text-primary" />
            </button>
          </motion.div>
        ) : (
          <>
            {/* Add to Cart Button */}
            <motion.button
              onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
              whileTap={{ scale: 0.95 }}
              className="mt-2 flex cursor-pointer  items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-xl shadow-md transition-all duration-200"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
