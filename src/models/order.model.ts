import mongoose, { Schema } from "mongoose";

// interface
interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    }
  ];
  totalAmount: string;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode?: string;
    fullAddress: string;
    latitude: string;
    longitude: string;
  };
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}
const addressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },
    fullAddress: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        grocery: {
          type: Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: String, required: true },
        unit: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    totalAmount: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    address: {
      type: addressSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "out of delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
