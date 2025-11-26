import mongoose, { Schema } from "mongoose";

// step---1
interface IUser {
  _id?: mongoose.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
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
      required: true,
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
  },
  { timestamps: true }
);
// step--->3
export const User = mongoose.models.User || mongoose.model("User", userSchema);
