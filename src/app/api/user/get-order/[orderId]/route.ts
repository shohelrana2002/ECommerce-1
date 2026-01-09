import connectDB from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    const { orderId } = await context.params;
    if (!orderId) {
      return NextResponse.json(
        { message: "Invalid Order Id" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json({ message: "No Order Found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get Order Failed Error: ${error}` },
      { status: 500 }
    );
  }
}
