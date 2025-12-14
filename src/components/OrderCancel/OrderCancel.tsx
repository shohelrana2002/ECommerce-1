"use client";

import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const OrderCancel = () => {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center
      bg-linear-to-b from-red-50 to-white overflow-hidden"
    >
      {/* ❌ Cancel Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="relative"
      >
        <XCircle className="text-red-500 w-24 h-24 md:w-28 md:h-28" />
        <motion.div
          animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-red-200 blur-3xl"
        />
      </motion.div>

      {/* ❌ Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-red-600 mt-6"
      >
        Payment Cancelled
      </motion.h1>

      {/* ❌ Message */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="text-gray-600 mt-3 text-sm md:text-base max-w-md"
      >
        Your payment was cancelled or failed. No money has been deducted. You
        can try again or return to your cart.
      </motion.p>

      {/* 📦 Animation Icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          duration: 2,
          delay: 0.9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-10"
      >
        <ShoppingCart className="w-16 h-16 md:w-20 md:h-20 text-red-500" />
      </motion.div>

      {/* 🔘 Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
        className="mt-12 flex gap-4 flex-wrap justify-center"
      >
        {/* Back to Cart */}
        <Link href="/user/cart">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 border border-red-500 text-red-600
              px-7 py-3 rounded-full font-semibold hover:bg-red-50 transition-all"
          >
            <ArrowLeft />
            Back to Cart
          </motion.div>
        </Link>

        {/* Retry Order */}
        <Link href="/user/checkout">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600
              text-white px-7 py-3 rounded-full font-semibold shadow-lg transition-all"
          >
            Try Again
          </motion.div>
        </Link>
      </motion.div>

      {/* 🌫 Background Effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-24 left-10 w-2 h-2 bg-red-300 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-12 w-2 h-2 bg-red-300 rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-red-200 rounded-full blur-sm" />
      </motion.div>
    </div>
  );
};

export default OrderCancel;
