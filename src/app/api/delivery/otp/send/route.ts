import connectDB from "@/lib/dbConnect";
import { sendMail } from "@/lib/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!orderId) {
      return NextResponse.json(
        { message: "Invalid Order Id / Order nopt found" },
        { status: 400 }
      );
    }

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    order.deliveryOtp = otp;
    await order.save();

    await sendMail(
      order?.user?.email,
      "Your delivery OTP",
      `
        <h2>Your Delivery OTP is <strong>${otp}</strong></h2>
        `
    );
    return NextResponse.json(
      { message: "OTP send successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Delivery Otp Send Error:${error}` },
      { status: 500 }
    );
  }
}
