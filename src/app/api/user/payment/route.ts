import connectDB from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    // validations
    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Order items required" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        {
          message: "Missing items, paymentMethod, totalAmount or address",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // create order (pending)
    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
      status: "pending",
    });

    // --------------------
    // COD ORDER
    // --------------------
    if (paymentMethod === "cod") {
      return NextResponse.json(
        {
          message: "Order placed successfully (COD)",
          order: newOrder,
        },
        { status: 201 }
      );
    }

    // --------------------
    // ONLINE PAYMENT (STRIPE)
    // --------------------
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      success_url: `${process.env.NEXT_BASE_URL}/user/order-success?orderId=${newOrder._id}`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,

      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "ShopVerse BD Order",
            },
            unit_amount: totalAmount * 100, // Stripe expects paisa
          },
          quantity: 1,
        },
      ],

      metadata: {
        orderId: newOrder._id.toString(), //.toString()
        userId: userId,
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Payment Error:", error);

    return NextResponse.json(
      { message: "Order Payment Error", error: error?.message },
      { status: 500 }
    );
  }
}
