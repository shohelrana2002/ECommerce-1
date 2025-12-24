import { auth } from "@/auth";
import connectDB from "@/lib/dbConnect";
import { Grocery } from "@/models/grocery.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const products = await Order.find({})
      .populate("user")
      .sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: `failed to get Mange data ${error}` });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const isEmailExist = await Grocery.findOne({ email: session?.user?.email });
    if (!isEmailExist) {
      return NextResponse.json({ message: "unauthorized" }, { status: 500 });
    }
    const products = await Grocery.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: `failed to get Mange data ${error}` });
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const session = await auth();
//     const isEmailExist = await Grocery.findOne({ email: session?.user?.email });
//     if (!isEmailExist) {
//       return NextResponse.json({ message: "unauthorized" }, { status: 500 });
//     }
//     const products = await Grocery.find({});
//     return NextResponse.json(products);
//   } catch (error) {
//     return NextResponse.json({ message: `failed to get Mange data ${error}` });
//   }
// }
