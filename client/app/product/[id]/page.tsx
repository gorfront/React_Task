"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/features/products/productsSlice";
import Image from "next/image";
import AddPhoto from "@/components/AddPhoto";
import ReactLoading from "react-loading";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [form, setForm] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [original, setOriginal] = useState<any>(null);

  useEffect(() => {
    dispatch(getProductById(id)).then((res) => {
      if (getProductById.fulfilled.match(res)) {
        setForm(res.payload);
        setOriginal(res.payload);
      }
    });
  }, [dispatch, id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const result = await dispatch(updateProduct({ id, data: form }));
    if (updateProduct.fulfilled.match(result)) setEditMode(false);
  };

  const handlerCancel = () => {
    setForm(original);
    setEditMode(false);
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      await dispatch(deleteProduct(id));
      router.push("/dashboard");
    }
  };

  const isOwner = user?._id === form?.owner._id;

  if (!form) {
    return (
      <div className="flex justify-center items-center h-64">
        <ReactLoading type="bars" color="#4f46e5" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl !mx-auto !p-6 !mt-6 bg-white shadow-lg rounded-md">
      {editMode ? (
        <>
          {form.image && (
            <Image
              src={form.image}
              alt={form.name}
              width={150}
              height={300}
              className="rounded w-[150px] h-auto !mb-4"
            />
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Name:</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="!mt-1 block w-full border rounded !px-3 !py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Price:</span>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                className="!mt-1 block w-full border rounded !px-3 !py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Discount:</span>
              <input
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className="!mt-1 block w-full border rounded !px-3 !py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Image:</span>
              <AddPhoto
                setPhoto={(url: any) =>
                  setForm((prev: any) => ({ ...prev, image: url }))
                }
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Description:</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="!mt-1 block w-full border rounded !px-3 !py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </label>
          </div>

          <div className="flex gap-4 !mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white !px-4 !py-2 rounded hover:bg-green-700 transition cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={handlerCancel}
              className="bg-gray-500 text-white !px-4 !py-2 rounded hover:bg-gray-600 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-4">
          <div className="min-w-[150px]">
            {form.image && (
              <Image
                src={form.image}
                alt={form.name}
                width={150}
                height={300}
                className="rounded w-[150px] h-auto"
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">{form.name}</h1>
            <p className="text-gray-700">
              Price: <span className="font-medium">${form.price}</span>
            </p>
            {form.discountPrice && (
              <p className="text-red-600">Discount: ${form.discountPrice}</p>
            )}
            <p className="text-gray-600">
              Description: <br />
              <span className="text-sm">{form.description}</span>
            </p>

            {isOwner && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 underline hover:text-red-800 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
