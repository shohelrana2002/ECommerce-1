import { auth } from "@/auth";
import connectDB from "@/lib/dbConnect";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    /*===========find to current user============== */
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json(
        { message: "Invalid delivery Boy Id" },
        { status: 400 }
      );
    }
    /*======= find now order with current order id ========== */
    const activeAssignment = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned",
    })
      .populate({
        path: "order",
        model: "Order",
        populate: { path: "address" },
      })
      .lean();
    if (!activeAssignment) {
      return NextResponse.json(
        { active: false, message: "No Current Delivery Assignment Found !!" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { active: true, assignment: activeAssignment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Delivery Current Order Failed error:${error}`,
      },
      { status: 500 }
    );
  }
}
