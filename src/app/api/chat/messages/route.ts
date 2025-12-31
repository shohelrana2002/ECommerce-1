import connectDB from "@/lib/dbConnect";
import Message from "@/models/message.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { roomId } = await req.json();
    const room = await Order.findById(roomId); // orderId===room
    if (!room) {
      return NextResponse.json({ message: "Room Not found" }, { status: 400 });
    }
    const messages = await Message.find({ roomId: room?._id });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get Message error:${error}` },
      { status: 500 }
    );
  }
}
