"use client";
import { Banknote, Package, Truck, Users } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
type propTypes = {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  };
  stats: {
    title: string;
    value: number;
  }[];
};

const AdminDashboardClient = ({ earning, stats }: propTypes) => {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">();
  const currentEarning =
    filter === "today"
      ? earning.today
      : filter === "sevenDays"
      ? earning.sevenDays
      : earning.total;

  const title =
    filter === "today"
      ? "Today's Earning"
      : filter === "sevenDays"
      ? "Last & Days Earning"
      : "Total Earning";
  return (
    <div className="pt-28 w-[90%] md:w-[80%] mx-auto">
      <div className="flex  flex-col  sm:flex-row sm:items-center sm:justify-between gap-4 mb-10  text-center sm:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold text-primary"
        >
          🏪 Admin Dashboard
        </motion.h1>
        <select
          className="border border-gray-300 rounded-xl px-4 py-2  text-sm focus:ring-2 focus:ring-green-500  outline-none  transition w-full sm:w-auto"
          onChange={(e) => setFilter(e.target.value as any)}
          value={filter}
        >
          <option value="total">Total</option>
          <option value="sevenDays">Last 7Days</option>
          <option value="today">Today</option>
        </select>
      </div>
      {/* ====== Show Now Earning====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-green-50  border border-green-200 shadow-sm rounded-2xl p-6 text-center mb-10"
      >
        <h2 className="text-lg font-semibold mb-2 text-primary">{title}</h2>
        <p className="text-4xl  font-extrabold  text-green-800">
          ৳{currentEarning.toString()}
        </p>
      </motion.div>
      {/* ===== show Here  Chat ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  mb-10 ">
        {stats?.map((s, i) => {
          const icons = [
            <Package className="text-primary w-6 h-6" />,
            <Users className="text-primary w-6 h-6" />,
            <Truck className="text-primary w-6 h-6" />,
            <span className="text-primary font-extrabold w-6 h-6">৳</span>,
            // <Banknote className="text-primary w-6 h-6" />,
          ];
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 1 }}
              className="bg-white border border-gray-100 shadow-md rounded-2xl p-5  flex items-center gap-4  hover:shadow-lg transition-all duration-300"
              key={i}
            >
              <div className="bg-green-100 p-3 rounded-xl ">{icons[i]}</div>
              <div>
                <p>{s?.title}</p>
                <p>{s?.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardClient;
