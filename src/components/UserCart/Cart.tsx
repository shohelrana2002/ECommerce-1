"use client";
import React from "react";
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  decreaseQuantity,
  ICart,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { cartData, deliveryFee, finalTotal, subTotal } = useSelector(
    (state: RootState) => state.cart
  );
  return (
    <div className="w-[95%] sm:w-[90%] mx-auto mt-8 mb-24 relative">
      <Link
        href={"/"}
        className="absolute flex top-2 left-0 cursor-pointer items-center gap-2 text-primary hover:text-green-800 font-medium  "
      >
        <ArrowLeft size={24} />
        <span className="hidden sm:inline"> Back To Home</span>
      </Link>
      <motion.h2
        initial={{ opacity: 0, y: -7 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-10"
      >
        🛒 Your Shopping Cart
      </motion.h2>

      {cartData?.length === 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: -7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-20 bg-white rounded-2xl shadow-md text-center mb-10"
          >
            <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className=" text-gray-400 mb-6 text-lg">
              Your Cart is empty.Add Som e Product to continue shopping!
            </p>
            <Link
              className="inline-flex mt-4 cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl  shadow-md transition-all duration-200 "
              href={"/"}
            >
              Continue Shopping
            </Link>
          </motion.div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* {JSON.stringify(cartData)} */}
          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence>
              {cartData?.map((item: ICart, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  //   transition={{ duration: 0.3 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-5 hover:shadow-xl  transition-all duration-300 border border-gray-100"
                >
                  <div className="relative w-28 h-28 sm:24 sm:h-24  md:28 md:h28 shrink-0  rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      className="object-contain  p-3 transition-transform  duration-300 hover:scale-105"
                      src={item?.image}
                      fill
                      sizes={"110px"}
                      alt={item?.name}
                    />
                  </div>
                  <div className="sm:mt-0 mt-4 sm:ml-4  flex-1 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {item?.unit}
                    </p>
                    <p className="text-primary font-bold mt-1 text-sm sm:text-base ">
                      ৳{Number(item?.price) * item?.quantity}
                    </p>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end gap-3 mt-3 sm:mt-0 bg-gray-50 px-3 py-2 rounded-full">
                    <button
                      onClick={() => dispatch(increaseQuantity(item._id))}
                      className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-full bg-green-100n hover:bg-green-200 transition-all"
                    >
                      <Plus size={16} className="text-primary" />
                    </button>
                    <span className="text-sm font-extrabold text-primary">
                      {item?.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(decreaseQuantity(item._id))}
                      className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-full bg-green-100n hover:bg-green-200 transition-all"
                    >
                      <Minus size={16} className="text-primary" />
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="sm:ml-4 mt-3 cursor-pointer sm:mt-0 text-red-500 hover:text-red-700 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24 border border-gray-100 flex flex-col"
          >
            <h4 className="text-lg sm:text-xl font-bold ">Order Summary</h4>
            <div className="space-y-3 text-gray-700 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-primary font-semibold">৳{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="text-primary font-semibold">
                  ৳{deliveryFee}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex font-medium text-lg sm:text-xl justify-between">
                <span>Total:</span>
                <span className="text-primary">৳{finalTotal}</span>
              </div>
            </div>
            <motion.button
              onClick={() => router.push("/user/checkout")}
              whileTap={{ scale: 0.95 }}
              className=" cursor-pointer mt-4 text-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl  shadow-md transition-all duration-200 "
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;
