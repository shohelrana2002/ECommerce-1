import connectDB from "@/lib/dbConnect";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const { status } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json(
        { message: "Order Not found !!" },
        { status: 400 }
      );
    }
    order.status = status;
    let deliveryBoysPayload: any = [];
    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      /*==========delivery boy find here 10km distance==========*/
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(latitude), Number(longitude)],
            },
            $maxDistance: 10000, //10km distance
          },
        },
      });
      /*====================near by id map and find to assigned data  or busyId===================*/
      const nearByIds = nearByDeliveryBoys?.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");
      const busyIdSet = new Set(busyIds.map((b) => String(b)));
      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b?._id))
      );
      const candidates = availableDeliveryBoys.map((b: any) => b._id);
      if (candidates?.length == 0) {
        await order.save();
        // socket call here
        await emitEventHandler("order-status-update", {
          orderId: order?._id,
          status: order?.status,
        });
        return NextResponse.json(
          { message: "No delivery Boys Available Now !!" },
          { status: 200 }
        );
      }
      /*===========delivery assignment============= */
      const deliveryAssignment = await DeliveryAssignment.create({
        order: order?._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      /*==================socket api call here ==================== */
      await deliveryAssignment.populate("order");
      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy?.socketId) {
          await emitEventHandler(
            "new-assignment",
            deliveryAssignment,
            boy?.socketId
          );
        }
      }

      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        mobile: b.mobile,
        name: b.name,
        longitude: b.location?.coordinates?.[0] ?? null,
        latitude: b.location?.coordinates?.[1] ?? null,
      }));

      await deliveryAssignment.populate("order");
    }
    /*============order save now data============= */
    await order.save();
    await order.populate("user");
    // socket call here
    await emitEventHandler("order-status-update", {
      orderId: order?._id,
      status: order?.status,
    });
    return NextResponse.json(
      {
        assignment: order.assignment?._id,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Updated Failed:${error}` },
      { status: 500 }
    );
  }
}
