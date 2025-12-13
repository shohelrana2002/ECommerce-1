"use client";

import { ArrowRight, CheckCircle, Package } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const OrderSuccess = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center
    bg-linear-to-b from-green-50 to-white
    "
    >
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
      >
        <CheckCircle className="text-primary w-24 h-24 md:w-28 md:h-28" />
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.3, 0, 0.3], scale: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="w-full h-full rounded-full bg-green-200 blur-3xl" />
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-primary mt-6"
      >
        Order Place Successfully
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="text-gray-600 mt-3 text-sm md:text-base max-w-md"
      >
        Thank You For Shopping Here
        <span className="font-bold text-primary"> My Orders</span>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          duration: 2,
          delay: 0.9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-10"
      >
        <Package className="w-16 h-16 md:w-20 md:h-20 text-primary" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
        className="mt-12"
      >
        <Link href={"/user/my-orders"}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-primary hover:bg-green-800 rounded-full text-white text-base font-semibold px-8 py-3 shadow-lg transition-all"
          >
            Go to My Orders <ArrowRight />
          </motion.div>
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-50 w-full h-full"
      >
        <div className="absolute top-20 left[-10%] w-2 h-2 bg-green-400 rounded-full animate-bounce" />
        <div className="absolute top-30 left[-30%] w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <div className="absolute top-24 left[-50%] w-2 h-2 bg-green-400 rounded-full animate-bounce" />
        <div className="absolute top-16 left[-70%] w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
