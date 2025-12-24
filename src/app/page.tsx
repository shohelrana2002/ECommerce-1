import { auth } from "@/auth";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import DeliveryBoyDashboard from "@/components/Dashboard/DeliveryBoyDashboard";
import UserDashboard from "@/components/Dashboard/UserDashboard";
import GeoUpdater from "@/components/GeoUpdater/GeoUpdater";
import EditRoleMobile from "@/components/Home/EditRoleMobile";
import Navbar from "@/components/Shared/Navbar";
import connectDB from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home() {
  // get user and find by id
  const session = await auth();
  await connectDB();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
    return;
  }
  const isOk =
    !user?.mobile || !user?.role || (!user?.mobile && user?.role == "user");
  if (isOk) {
    return <EditRoleMobile />;
  }
  const userData = user ? JSON.parse(JSON.stringify(user)) : null;
  return (
    <>
      <Navbar user={userData} />
      <GeoUpdater userId={userData?._id} />
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "deliveryBoy" && <DeliveryBoyDashboard />}
      {user?.role === "user" && <UserDashboard />}
    </>
  );
}
