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
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const stock = formData.get("stock") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;
    let imageUrl;
    if (file) {
      imageUrl = await uploadImage(file);
    }
    // const imageUrl = file ? await uploadImage(file) : "";

    const grocery = await Grocery.create({
      name,
      price,
      unit,
      description,
      category,
      stock,
      email: session?.user?.email,
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

// app/api/admin/addGrocery/route.ts
// import { auth } from "@/auth";
// import uploadImage from "@/lib/cloudinary";
// import connectDB from "@/lib/dbConnect";
// import { Grocery } from "@/models/grocery.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const session = await auth();
//     if (session?.user?.role !== "admin") {
//       return NextResponse.json(
//         { message: "Unauthorized access" },
//         { status: 401 }
//       );
//     }

//     const formData = await req.formData();
//     const name = formData.get("name")?.toString() || "";
//     const category = formData.get("category")?.toString() || "";
//     const unit = formData.get("unit")?.toString() || "";
//     const stock = formData.get("stock")?.toString() || "";
//     const description = formData.get("description")?.toString() || "";
//     const price = formData.get("price")?.toString() || "";
//     const file = formData.get("image") as Blob | null;

//     let imageUrl: string | null = null;
//     if (file) {
//       try {
//         imageUrl = await uploadImage(file);
//       } catch (imgErr) {
//         console.error("Cloudinary upload error:", imgErr);
//         return NextResponse.json(
//           {
//             message: `Failed to upload image: ${
//               imgErr instanceof Error ? imgErr.message : JSON.stringify(imgErr)
//             }`,
//           },
//           { status: 500 }
//         );
//       }
//     }

//     const grocery = await Grocery.create({
//       name,
//       price,
//       unit,
//       description,
//       category,
//       stock,
//       image: imageUrl,
//     });

//     return NextResponse.json(grocery, { status: 200 });
//   } catch (error) {
//     console.error("Add grocery error:", error);
//     return NextResponse.json(
//       {
//         message: `Failed to add product: ${
//           error instanceof Error ? error.message : JSON.stringify(error)
//         }`,
//       },
//       { status: 500 }
//     );
//   }
// }
