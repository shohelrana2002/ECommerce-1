"use client";

import { LeafIcon, Upload, PlusIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
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
];

export default function AddProductsPage() {
  const [loading, setLoading] = useState(false);
  // -------------------------
  // 🍀 All States
  // -------------------------
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // -------------------------
  // 🍀 Image Handler
  // -------------------------
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("unit", unit);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("category", category);

    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      setLoading(true);

      const res = await axios.post("/api/admin/addProduct", formData);

      if (res?.data?._id) {
        toast.success(`${res?.data?.name} added success`);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-linear-to-br from-green-100 to-green-50 
      py-16 px-6 relative flex justify-center items-start"
    >
      {/* Back button */}
      <motion.div initial={{ x: -40 }} animate={{ x: 0 }}>
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-green-700 
            hover:text-green-900 font-semibold bg-green-100 px-4 py-2 
            rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <LeafIcon size={20} />
          Back Home
        </Link>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        className="bg-white w-full max-w-3xl shadow-2xl rounded-2xl p-10 border 
        border-green-200/70 backdrop-blur"
      >
        <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <PlusIcon /> Add New Grocery Product
        </h1>

        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <label className="font-medium text-gray-700">Product Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Mango, Milk, Chips..."
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 shadow-sm"
              required
            />
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <label className="font-medium text-gray-700">Price</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="100"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 shadow-sm"
              required
            />
          </motion.div>

          {/* Unit */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <label className="font-medium text-gray-700">Unit</label>

            <select
              onChange={(e) => setUnit(e.target.value)}
              value={unit}
              className="border rounded-lg px-4 py-2 focus:ring-2 
                focus:ring-green-400 shadow-sm bg-white cursor-pointer"
              required
            >
              <option value="">Select Unit</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="liter">Liter (L)</option>
              <option value="ml">Milliliter (ml)</option>
              <option value="piece">Piece (pc)</option>
              <option value="packet">Packet</option>
              <option value="dozen">Dozen</option>
            </select>
          </motion.div>

          {/* Stock */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <label className="font-medium text-gray-700">Stock</label>
            <input
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              type="number"
              placeholder="100"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 shadow-sm"
              required
            />
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <label className="font-medium text-gray-700">Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 shadow-sm"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2 md:col-span-2"
          >
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={3}
              placeholder="Short description..."
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 shadow-sm"
            ></textarea>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2 md:col-span-2"
          >
            <label className="font-medium text-gray-700">Product Image</label>

            <label
              htmlFor="image-upload"
              className="border-2 border-dashed border-green-400 rounded-lg 
                flex flex-col items-center justify-center py-6 cursor-pointer
                hover:bg-green-50 hover:border-green-500 transition-all shadow-sm"
            >
              <Upload className="text-green-600 mb-2" />
              <span className="text-gray-600">Click to upload image</span>
            </label>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            {imagePreview && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Image
                  src={imagePreview}
                  alt="upload image"
                  width={120}
                  height={120}
                  className="w-32 h-32 object-cover rounded-xl mt-4 border shadow-md"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            // whileHover={{ scale: 1.03 }}
            // whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-green-600 hover:bg-green-700 
    text-white font-semibold py-3 rounded-xl shadow-md 
    flex justify-center items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              "Add Product"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
