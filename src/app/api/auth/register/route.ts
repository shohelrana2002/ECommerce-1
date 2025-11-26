import connectDB from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json(
        { message: "Already email exist ! Try Other Email" },
        { status: 400 }
      );
    }
    if (password?.length < 6) {
      return NextResponse.json(
        { message: "Password Must be 6character" },
        { status: 400 }
      );
    }
    const passwordConvert = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: passwordConvert,
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Failed Registration error ${error}` },
      { status: 401 }
    );
  }
}

// name email,password
//------------------ condition-------
// email check
// password check 6 length or password hash by bcrypt
