import Hero from "../Home/Hero";
import CategorySlider from "../CategorySlider/CategorySlider";
import { TUnit } from "@/models/grocery.model";
import GroceryItemCard from "../ProductsCards/GroceryItemCard";
import mongoose from "mongoose";
import Link from "next/link";
interface IGrocery {
  _id: mongoose.Types.ObjectId;
  email?: string;
  name: string;
  description?: string;
  category: string;
  price: string;
  stock: string;
  unit: TUnit;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export default async function UserDashboard({
  groceryList,
}: {
  groceryList: IGrocery[];
}) {
  // await connectDB();

  // const products = await Grocery.find({});
  const convertToJson = JSON.parse(JSON.stringify(groceryList));
  return (
    <>
      <Hero />
      <CategorySlider />
      {/* <div className="mx-auto w-[90%] md:[80%] mt-10">
        <h2 className="font-bold text-primary text-xl md:text-3xl text-center mb-5">
          Popular Grocery Items
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {convertToJson.length > 0 ? (
            convertToJson.map((item: IGrocery, index: number) => (
              <GroceryItemCard key={index} item={item} />
            ))
          ) : (
            <div className="mt-28">
              <p className="my-12 text-center text-primary">No Data Found</p>
              <Link href={"/"} className="">
                Loaded All Product
              </Link>
            </div>
          )}
        </div>
      </div> */}
      <div className="mx-auto w-[90%] md:w-[80%] mt-12">
        <h2 className="font-bold text-primary text-xl md:text-3xl text-center mb-8">
          Popular Grocery Items
        </h2>

        {convertToJson.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {convertToJson.map((item: IGrocery) => (
              <GroceryItemCard key={item._id?.toString()} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="mb-6 text-primary text-lg font-semibold">
              No Products Found
            </p>

            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-md transition hover:opacity-90"
            >
              Load All Products
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
