import connectDB from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const { userId, socketId } = await req.json();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        socketId,
        isOnline: true,
      },
      { new: true }
    );
    if (!user) {
      return NextResponse.json(
        { message: "Failed To update to user" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Socket Connected Failed :${error}` },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const { userId, socketId } = await req.json();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        socketId,
        isOnline: true,
      },
      { new: true }
    );
    if (!user) {
      return NextResponse.json(
        { message: "Failed To update to user" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Socket Connected Failed :${error}` },
      { status: 500 }
    );
  }
}
