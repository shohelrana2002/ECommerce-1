import { auth } from "@/auth";
import connectDB from "@/lib/dbConnect";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    /*========== current user id with session ============== */
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json(
        {
          message: "No deliveryBoy Find This Id",
        },
        { status: 400 }
      );
    }
    /*================assignments now ================ */
    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        {
          message: "No Assignment Found !!",
        },
        { status: 400 }
      );
    }
    if (assignment?.status !== "broadcasted") {
      return NextResponse.json(
        {
          message: "assignment expired !!",
        },
        { status: 400 }
      );
    }
    /*==============already assigned check ============== */
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] },
    });
    if (alreadyAssigned) {
      return NextResponse.json(
        {
          message: "Already Assigned To Other Order",
        },
        { status: 400 }
      );
    }
    /*=============== Now Change a Status Now && save assignment ==============*/
    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    /*===============now single order findBy assignmentBy id & success message send========= */
    const order = await Order.findById(assignment?.order);
    if (!order) {
      return NextResponse.json(
        {
          message: "No Assignment Order Find  !!",
        },
        { status: 400 }
      );
    }
    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();
    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment?._id },
        broadcastedTo: deliveryBoyId,
        status: "broadcasted",
      },
      {
        $pull: { broadcastedTo: deliveryBoyId },
      }
    );

    return NextResponse.json(
      {
        message: "Order Accepted Successfully 🎉🎇",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Order Accepted Error:${error}` },
      { status: 500 }
    );
  }
}
