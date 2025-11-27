import mongoose, { Schema } from "mongoose";

// step---1
export interface IUser {
  _id?: mongoose.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}
// step----2
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "deliveryBoy", "admin"],
      default: "user",
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
// step--->3
export const User = mongoose.models.User || mongoose.model("User", userSchema);
