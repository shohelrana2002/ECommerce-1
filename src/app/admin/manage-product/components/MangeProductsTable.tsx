"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  stock: string;
  description?: string;
  image: string;
}

const MangeProductsTable = () => {
  const [products, setProducts] = useState<IGrocery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/admin/manage-product");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      console.log(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-green-50">
      {/* Back Home Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-lg mb-6 shadow transition"
      >
        <ArrowLeft size={20} /> Back Home
      </Link>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-green-100">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Image
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Unit
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Stock
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b hover:bg-green-50 transition"
              >
                <td className="py-3 px-6">
                  <Image
                    width={45}
                    height={45}
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-6">{product.name}</td>
                <td className="py-3 px-6">{product.category}</td>
                <td className="py-3 px-6">{product.price}</td>
                <td className="py-3 px-6">{product.unit}</td>
                <td className="py-3 px-6">{product.stock}</td>
                <td className="py-3 px-6 flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded shadow"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MangeProductsTable;
