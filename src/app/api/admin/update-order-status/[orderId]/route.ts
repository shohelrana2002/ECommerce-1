import connectDB from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const { status } = await req.json();
    const order = await Order.findById(orderId).populate("User");
    if (!order) {
      return NextResponse.json(
        { message: "No Order Id Find !!" },
        { status: 400 }
      );
    }
    order.status = status;
    let availableDeliveryBoy: any = [];
    if (status === "out of delivery" && !order?.assignment) {
      const { latitude, longitude } = order?.address;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Updated Failed:${error}` },
      { status: 500 }
    );
  }
}
