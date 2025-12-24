import connectDB from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const { userId, location } = await req.json();
    if (!userId || !location) {
      return NextResponse.json(
        { message: "Location or user id required" },
        { status: 404 }
      );
    }
    const user = await User.findByIdAndUpdate(userId, { location });
    if (!user) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 404 });
    }
    return NextResponse.json({ message: "Location update" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `update failed :${error}` },
      { status: 500 }
    );
  }
}
