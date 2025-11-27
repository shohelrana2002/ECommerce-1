import { auth } from "@/auth";
import EditRoleMobile from "@/components/Home/EditRoleMobile";
import connectDB from "@/lib/dbConnect";
import { User } from "@/models/user.model";

export default async function Home() {
  // get user and find by id
  const session = await auth();
  await connectDB();
  const user = await User.findById(session?.user?.id);
  console.log(user);
  return (
    <>
      <EditRoleMobile />
    </>
  );
}
