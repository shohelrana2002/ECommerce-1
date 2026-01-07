import connectDB from "@/lib/dbConnect";
import DeliveryBoyDashboard from "../DeliveryBoy/DeliveryBoyDashboard";
import { auth } from "@/auth";
import Order from "@/models/order.model";

export default async function DeliveryBoyDashboardPage() {
  await connectDB();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;
  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOtpVerification: true,
  });

  const today = new Date().toDateString();
  const todayOrders = orders?.filter(
    (o) => new Date(o?.deliveredAt)?.toDateString() == today
  )?.length;
  const todayEarning = todayOrders * 40;
  return (
    <>
      <DeliveryBoyDashboard earning={todayEarning} />
    </>
  );
}
