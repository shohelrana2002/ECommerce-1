import mongoose, { Schema } from "mongoose";

export type TUnit = "kg" | "g" | "liter" | "ml" | "piece" | "packet" | "dozen";
// step ----------> interface
export interface IGrocery {
  _id?: mongoose.Types.ObjectId;
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
// step-------------->mongoes
export const grocerySchema = new Schema<IGrocery>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Fish",
        "Meat",
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, Atta & Grains",
        "Snacks & Biscuits",
        "Spices & Masalas",
        "Beverages & Drinks",
        "Personal Care",
        "Household Essentials",
        "Instant & Packaged Food",
        "Baby & Pet Care",
        "Medicine",
      ],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: ["kg", "g", "liter", "ml", "piece", "packet", "dozen"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const Grocery =
  mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);
