import { auth } from "@/auth";
import connectDB from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { mobile, role } = await req.json();
    const session = await auth();
    const findUser = await User.findOneAndUpdate(
      {
        email: session?.user?.email,
      },
      { role, mobile },
      { new: true }
    );
    if (!findUser) {
      return NextResponse.json({ message: `user cant find` }, { status: 4000 });
    }
    return NextResponse.json(findUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `role mobile can't update ${error}` },
      { status: 4000 }
    );
  }
}
