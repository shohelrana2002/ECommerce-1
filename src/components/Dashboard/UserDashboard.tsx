import Hero from "../Home/Hero";
import CategorySlider from "../CategorySlider/CategorySlider";
import connectDB from "@/lib/dbConnect";
import { Grocery, IGrocery } from "@/models/grocery.model";
import GroceryItemCard from "../ProductsCards/GroceryItemCard";

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
          {convertToJson.map((item: IGrocery) => (
            <GroceryItemCard
              key={item._id ? item._id.toString() : undefined}
              item={item}
            />
          ))}
        </div>
      </div>
    </>
  );
}
