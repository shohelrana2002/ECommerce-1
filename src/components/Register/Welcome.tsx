"use client";
import { stePropTypes } from "@/types/propTypes";
import { ArrowBigRight, Bike, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";
const Welcome = ({ nextStep }: stePropTypes) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="flex items-center gap-3"
      >
        <ShoppingBasket className="w-24 h-24 md:w-32 md:h-32 text-green-600" />
        <h2 className="text-xl md:text-5xl font-extrabold text-green-700">
          ShopVerse BD
        </h2>
      </motion.div>
      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.3,
        }}
        className="text-center mt-4 text-gray-700 text-lg md:text-xl max-w-3/6 w-full"
      >
        ShopVerse BD is a complete online marketplace in Bangladesh, offering
        all types of products in one place — electronics, fashion, home
        essentials, groceries, and more. Fast delivery, trusted quality, and a
        seamless shopping experience, all in one universe of products.
      </motion.p>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.5,
        }}
        className="flex items-center mt-10 gap-10"
      >
        <ShoppingBasket className="w-24 h-24 md:w-28 md:h-28 text-green-600" />
        <Bike className="w-24 h-24 md:w-32 md:h-32 text-orange-600" />
      </motion.div>
      <motion.button
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.5,
        }}
        className="inline-flex mt-10 cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl  shadow-md transition-all duration-200 "
        onClick={() => nextStep(2)}
      >
        Next <ArrowBigRight />
      </motion.button>
    </div>
  );
};

export default Welcome;
