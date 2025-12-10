import Hero from "../Home/Hero";
import CategorySlider from "../CategorySlider/CategorySlider";
import connectDB from "@/lib/dbConnect";
import { Grocery, TUnit } from "@/models/grocery.model";
import GroceryItemCard from "../ProductsCards/GroceryItemCard";
import mongoose from "mongoose";
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
export default async function UserDashboard() {
  await connectDB();

  const products = await Grocery.find({});
  const convertToJson = JSON.parse(JSON.stringify(products));
  return (
    <>
      <Hero />
      <CategorySlider />
      <div className="mx-auto w-[90%] md:[80%] mt-10">
        <h2 className="font-bold text-primary text-xl md:text-3xl text-center mb-5">
          Popular Grocery Items
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {convertToJson.map((item: IGrocery, index: number) => (
            <GroceryItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
