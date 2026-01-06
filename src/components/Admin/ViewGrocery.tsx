"use client";
import { Pencil, Trash2, UploadIcon, X } from "lucide-react";
import { IGrocery, TUnit } from "@/models/grocery.model";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LeafIcon, Search } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const MotionLink = motion(Link);
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
const units: TUnit[] = ["kg", "g", "liter", "ml", "piece", "packet", "dozen"];

const ViewGrocery = () => {
  const [groceries, setGroceries] = useState<IGrocery[]>([]);
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backedImage, setBackendImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getGroceries = async () => {
      try {
        const { data } = await axios.get("/api/admin/get-grocery");
        setGroceries(data);
      } catch (error) {
        console.log(error);
      }
    };
    getGroceries();
  }, []);
  useEffect(() => {
    if (editing) {
      setImagePreview(editing?.image);
    }
  }, [editing]);
  /*========== Upload Image Preview ========= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setBackendImage(file);
    // setEditing((prev) => (prev ? { ...prev, image: previewUrl } : prev));
  };
  const handleEditProduct = async (e: React.FormEvent) => {
    setLoading(true);
    if (!editing) return;
    const formData = new FormData();
    formData.append("groceryId", editing?._id?.toString()!);
    formData.append("name", editing?.name);
    formData.append("price", editing?.price);
    formData.append("unit", editing?.unit);
    formData.append("category", editing?.category);

    if (backedImage) {
      formData.append("image", backedImage);
    }
    try {
      const res = await axios.post("/api/admin/edit-grocery", formData);
      const updatedProduct = res?.data;
      if (res.status === 200) {
        setGroceries((prev) =>
          prev.map((item) =>
            item._id === updatedProduct._id ? updatedProduct : item
          )
        );
        toast.success(`${updatedProduct?.name} updated successfully`);
        setEditing(null); // modal close
        setBackendImage(null);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  /**========== Handle Delete Fun===== */
  const handleDelete = async (id: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;
    try {
      const result = await axios.post("/api/admin/delete-grocery", {
        groceryId: id,
      });
      if (result?.status === 200 || result?.status == 201) {
        toast.success("Delete Success");
        setGroceries((prev) => prev.filter((g) => (g?._id || []) !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative pt-6  pb-10 w-[95%] md:w-[85%] mx-auto bg-linear-to-br from-green-100 via-green-50 to-white rounded-3xl shadow-sm">
      {/* Header Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6">
        {/* Back Button */}
        <MotionLink
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex w-fit items-center gap-2
        bg-white/80 backdrop-blur-md
        text-green-700 font-semibold px-4 py-2
        rounded-2xl shadow-md border border-green-100
        hover:text-green-900 hover:shadow-lg transition-all"
        >
          <LeafIcon size={20} />
          Back
        </MotionLink>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xl md:text-3xl font-extrabold
        text-green-800 tracking-wide flex items-center justify-center gap-2"
        >
          🧾 Manage Products
        </motion.h2>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative w-full md:w-64"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
          />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl
          border border-green-200 bg-white/80
          focus:outline-none focus:ring-2 focus:ring-green-400
          transition-all"
          />
        </motion.div>
      </div>
      {/* === Groceries == */}
      <div className="space-y-4 mt-12">
        {groceries?.map((g, i) => (
          <motion.div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl  border border-gray-100 flex flex-col sm:flex-row  gap-5 p-5 transition-all"
            whileHover={{ scale: 1.0099 }}
            transition={{ type: "spring", stiffness: 100 }}
            key={i}
          >
            {/* Image */}
            <div className="relative w-full sm:w-44 aspect-square rounded-xl   overflow-hidden border border-gray-200 shrink-0">
              <Image
                className="object-cover hover:scale-110 transition-transform duration-500"
                src={g.image}
                alt={g.name}
                fill
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Name */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  {g.name}
                </h3>

                {/* Category */}
                <p className="text-sm text-green-600 font-medium">
                  Category: {g.category}
                </p>

                {/* Description */}
                {g.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {g.description}
                  </p>
                )}

                {/* Price + Stock */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span
                    className="px-3 py-1 text-sm font-semibold rounded-full 
          bg-green-100 text-green-700"
                  >
                    ৳ {g.price} / {g.unit}
                  </span>

                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full
          ${
            Number(g.stock) > 0
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
                  >
                    Stock: {g.stock}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center  sm:justify-between gap-3 mt-4">
                {/* Date */}
                <span className="text-xs text-gray-400">
                  Added on{" "}
                  {g.createdAt
                    ? new Date(g.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Edit */}
                  <motion.button
                    onClick={() => setEditing(g)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center cursor-pointer gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold  bg-blue-50 text-blue-700  hover:bg-blue-100 transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </motion.button>

                  {/* Delete */}
                  <motion.button
                    onClick={() => handleDelete(g?._id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1.5  rounded-xl text-sm font-semibold cursor-pointer  bg-red-50 text-red-700  hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* ======== Edit Modal ======== */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-md rounded-2xl
          shadow-2xl p-6 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-green-700">
                  ✏️ Edit Product
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="text-gray-500  cursor-pointer hover:text-red-600 transition"
                >
                  <X />
                </button>
              </div>

              {/* Image Preview + Upload */}
              <div className="flex flex-col items-center gap-3 mb-4">
                {/* Image */}
                <div className="relative w-32 h-32 sm:w-48 sm:h-40  rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>

                {/* Upload Button */}
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-2 cursor-pointer  px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                >
                  <UploadIcon size={18} />
                  Change Image
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Form */}
              <div className="space-y-3">
                {/* Name */}
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  placeholder="Product name"
                  className="w-full rounded-xl border px-3 py-2
              focus:ring-2 focus:ring-green-500 outline-none"
                />

                {/* Category */}
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  className="w-full rounded-xl border px-3 py-2 bg-white
              focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option disabled>Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Price */}
                <input
                  type="text"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: e.target.value })
                  }
                  placeholder="Price"
                  className="w-full rounded-xl border px-3 py-2
              focus:ring-2 focus:ring-green-500 outline-none"
                />

                {/* Unit */}
                <select
                  value={editing?.unit}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      unit: e.target.value as TUnit,
                    })
                  }
                  className="w-full rounded-xl border px-3 py-2 bg-white
              focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                {/* Stock */}
                <input
                  type="number"
                  value={editing.stock}
                  onChange={(e) =>
                    setEditing({ ...editing, stock: e.target.value })
                  }
                  placeholder="Stock"
                  className="w-full rounded-xl border px-3 py-2
              focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  disabled={loading}
                  onClick={handleEditProduct}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 cursor-pointer rounded-xl bg-green-600
              text-white py-2 font-semibold hover:bg-green-700"
                >
                  {loading ? "Updating...." : "  Save Changes"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(null)}
                  className="flex-1 rounded-xl bg-gray-100
              text-gray-700  cursor-pointer py-2 font-semibold hover:bg-gray-200"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewGrocery;
