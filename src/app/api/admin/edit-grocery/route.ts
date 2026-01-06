import { auth } from "@/auth";
import uploadImage from "@/lib/cloudinary";
import connectDB from "@/lib/dbConnect";
import { Grocery } from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: `unauthorized access` },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const groceryId = formData.get("groceryId") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    // const stock = formData.get("stock") as string;
    // const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;
    let imageUrl;
    if (file) {
      imageUrl = await uploadImage(file);
    }
    // const imageUrl = file ? await uploadImage(file) : "";

    const grocery = await Grocery.findByIdAndUpdate(groceryId, {
      name,
      price,
      category,
      unit,
      image: imageUrl,
    });

    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to upload image ${error}` },
      { status: 500 }
    );
  }
}
