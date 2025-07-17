"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createProduct } from "@/features/products/productsSlice";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import AddPhoto from "@/components/AddPhoto";

export default function CreateProductPage() {
  useAuthGuard();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    description: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice
        ? parseFloat(form.discountPrice)
        : undefined,
      description: form.description,
      image: form.image,
    };
    const result = await dispatch(createProduct(payload));
    if (createProduct.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-lg !mx-auto !mt-10 bg-white shadow-md rounded-md !p-6">
      <h1 className="text-3xl font-semibold text-gray-800 !mb-6">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          value={form.name}
          required
          className="w-full !px-4 !py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          value={form.price}
          required
          className="w-full !px-4 !py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="discountPrice"
          type="number"
          placeholder="Discounted Price (optional)"
          onChange={handleChange}
          value={form.discountPrice}
          className="w-full !px-4 !py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Product Image</label>
          <AddPhoto
            setPhoto={(url: string) =>
              setForm((prev) => ({ ...prev, image: url }))
            }
          />
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          value={form.description}
          rows={4}
          className="w-full !px-4 !py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white !px-5 !py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Create
        </button>
      </form>
    </div>
  );
}
