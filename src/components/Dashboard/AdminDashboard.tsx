import React from "react";
import AdminDashboardClient from "../Admin/AdminDashboardClient";
import connectDB from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { User } from "@/models/user.model";
import { Grocery } from "@/models/grocery.model";

export default async function AdminDashboard() {
  await connectDB();
  const orders = await Order.find({});
  const users = await User.find({ role: "user" });
  const groceries = await Grocery.find({});

  const totalOrders = orders?.length;
  const totalCustomers = users?.length;
  const pendingDelivery = orders?.filter((p) => p?.status === "pending").length;
  const totalRevenue = orders?.reduce(
    (sum, o) => sum + (o?.totalAmount || 0),
    0
  );

  const toDay = new Date();
  const startToDay = new Date(toDay);
  startToDay.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo?.setDate(toDay.getDate() - 6);

  const todayOrders = orders?.filter((order) => order?.createdAt >= startToDay);
  const todayRevenue = todayOrders?.reduce(
    (sum, order) => sum + (order?.totalAmount || 0),
    0
  );
  const sevenDaysOrders = orders?.filter(
    (order) => new Date(order?.createdAt) >= sevenDaysAgo
  );
  const sevenDaysRevenue = sevenDaysOrders?.reduce(
    (sum, order) => sum + (order?.totalAmount || 0),
    0
  );
  return (
    <>
      <AdminDashboardClient
        earning={{
          today: todayRevenue,
          sevenDays: sevenDaysRevenue,
          total: totalRevenue,
        }}
      />
    </>
  );
}
//
