import connectDB from "@/lib/dbConnect";
import ChatRoom from "@/models/chatRoom.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, orderId, deliveryBoyId } = await req.json();
    let room = await ChatRoom.findById({ orderId });
    if (!room) {
      room = await ChatRoom.create({
        orderId,
        userId,
        deliveryBoyId,
      });
    }
    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Room Created Failed Error:${error}` },
      { status: 500 }
    );
  }
}
