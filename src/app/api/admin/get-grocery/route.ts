import connectDB from "@/lib/dbConnect";
import { Grocery } from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const groceries = await Grocery.find({}).sort({ createdAt: -1 });
    if (!groceries) {
      return NextResponse.json(
        { message: "No Grocery Found !!" },
        { status: 400 }
      );
    }
    return NextResponse.json(groceries, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: `Grocery All Data Get error: ${error}`,
    });
  }
}
