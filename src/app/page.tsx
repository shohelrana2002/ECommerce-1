import { auth } from "@/auth";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import DeliveryBoyDashboard from "@/components/Dashboard/DeliveryBoyDashboard";
import UserDashboard from "@/components/Dashboard/UserDashboard";
import GeoUpdater from "@/components/GeoUpdater/GeoUpdater";
import EditRoleMobile from "@/components/Home/EditRoleMobile";
import Navbar from "@/components/Shared/Navbar";
import connectDB from "@/lib/dbConnect";
import { Grocery, IGrocery } from "@/models/grocery.model";
import { User } from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  /*========= Search Query Here ============ */
  const searchParams = await props?.searchParams;

  // get user and find by id
  await connectDB();
  const session = await auth();
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

  let groceryList: any[] = []; // IGrocery
  if (user?.role === "user") {
    if (searchParams?.q) {
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams?.q || "", $options: "i" } },
          { category: { $regex: searchParams?.q || "", $options: "i" } },
          { price: { $regex: searchParams?.q || "", $options: "i" } },
        ],
      });
    } else {
      groceryList = await Grocery.find({});
    }
  }
  return (
    <>
      <Navbar user={userData} />
      <GeoUpdater userId={userData?._id} />
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "deliveryBoy" && <DeliveryBoyDashboard />}
      {user?.role === "user" && <UserDashboard groceryList={groceryList} />}
    </>
  );
}
