import connectDB from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Order items required" },
        { status: 400 }
      );
    }
    if (!items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        {
          message:
            "Missing anyone here items, paymentMethod, totalAmount, address",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User Cant't find" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Order Post Error:${error}` },
      { status: 500 }
    );
  }
}
