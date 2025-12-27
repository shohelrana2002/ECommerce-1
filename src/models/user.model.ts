import mongoose, { Schema } from "mongoose";

// step---1
export interface IUser {
  _id?: mongoose.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  location?: {
    type: {
      type: StringConstructor;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: NumberConstructor[];
      default: number[];
    };
  };
  image?: string;
  socketId?: string | null;
  isOnline?: boolean;
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
    // location mongoDB Near
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    image: {
      type: String,
      required: false,
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
/*===========location ===============*/
userSchema.index({ location: "2dsphere" });

// step--->
export const User = mongoose.models.User || mongoose.model("User", userSchema);
