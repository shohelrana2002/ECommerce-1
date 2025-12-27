// import { auth } from "@/auth";
// import connectDB from "@/lib/dbConnect";
// import DeliveryAssignment from "@/models/deliveryAssignment.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest, res: NextResponse) {
//   try {
//     await connectDB();
//     const session = await auth();
//     const assignments = await DeliveryAssignment.find({
//       broadcastedTo: session?.user?.id,
//       status: "broadcasted",
//     }).populate("order");
//     if (!assignments) {
//       return NextResponse.json(
//         { message: "No Assignment Available now" },
//         { status: 304 }
//       );
//     }
//     return NextResponse.json(assignments, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: `Get Delivery assignment failed:${error}` },
//       { status: 500 }
//     );
//   }
// }

import { auth } from "@/auth";
import connectDB from "@/lib/dbConnect";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // get authenticated user session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // convert user id to ObjectId for query
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // find all assignments for this user with status 'broadcasted'
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: userId,
      status: "broadcasted",
    }).populate({
      path: "order",
      model: "Order", // ensures populate uses correct model
      populate: { path: "user", model: "User" }, // optional: also populate order.user
    });

    if (!assignments || assignments.length === 0) {
      return NextResponse.json(
        { message: "No assignments available" },
        { status: 200 }
      );
    }

    return NextResponse.json(assignments, { status: 200 });
  } catch (error: any) {
    console.error("Get Assignments Error:", error);
    return NextResponse.json(
      { message: "Failed to get assignments", error: error.message },
      { status: 500 }
    );
  }
}
