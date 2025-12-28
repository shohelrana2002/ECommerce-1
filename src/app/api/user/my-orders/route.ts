import { auth } from "@/auth";
import connectDB from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const order = await Order.find({ user: session?.user?.id })
      .populate("user assignedDeliveryBoy")
      .sort({ createdAt: -1 });
    if (!order) {
      return NextResponse.json({ message: "Order cant get" }, { status: 400 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `My Orders Data Get Failed${error}` },
      { status: 500 }
    );
  }
}
