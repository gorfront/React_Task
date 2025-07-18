"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchProducts,
  deleteProduct,
} from "../../features/products/productsSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchInput from "@/components/Search";
import ReactLoading from "react-loading";
// import { importFakeProducts } from "@/lib/importFakeProducts";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchProducts({ search }));
    }, 700);

    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  const filtered = showOnlyMine
    ? products.filter((p) => p.owner?._id === authUser?._id)
    : products;

  const handleDelete = (id: string) => {
    if (confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="!p-6 max-w-7xl !mx-auto">
      <h1 className="text-3xl font-bold !mb-6 text-gray-800">Dashboard</h1>

      <SearchInput value={search} setValue={setSearch} />

      {authUser && (
        <div className="!mb-4 flex items-center gap-2 space-x-2">
          <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
            {/* <button
              onClick={async () => {
                const ok = confirm("Իմպորտե՞լ fake ապրանքները։");
                if (ok) {
                  await importFakeProducts();
                  dispatch(fetchProducts());
                  alert("Իմպորտն ավարտված է");
                }
              }}
              className="mt-6 bg-purple-600 text-white !px-4 !py-2 rounded disabled:opacity-50"
            >
              "Import fake products"
            </button> */}
            <input
              type="checkbox"
              checked={showOnlyMine}
              onChange={() => setShowOnlyMine(!showOnlyMine)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span>Only my products</span>
          </label>
          <p>({products.length})</p>
        </div>
      )}

      {error && <p className="text-red-600 !mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center !mt-10">
          <ReactLoading type="spin" color="#4f46e5" height={40} width={40} />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {!filtered.length ? (
            <p className="text-gray-500 col-span-full">No products found.</p>
          ) : (
            filtered
              .map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow hover:shadow-md transition bg-white !p-4 relative group cursor-pointer"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  {authUser?._id && authUser?._id === product.owner?._id && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white !px-2 !py-0.5 text-xs rounded">
                      My product
                    </span>
                  )}

                  {product.image && (
                    <div className="!mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={140}
                        className="object-cover rounded w-full h-[140px]"
                      />
                    </div>
                  )}

                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-600 !mt-1">
                    Price: <span className="font-medium">${product.price}</span>
                  </p>

                  {product.discountPrice && (
                    <p className="text-sm text-red-500">
                      Discount: ${product.discountPrice}
                    </p>
                  )}

                  <p className="text-sm !mt-1 text-gray-500">
                    Owner: {product.owner?.firstName} {product.owner?.lastName}
                  </p>

                  {authUser?._id === product.owner?._id && (
                    <div
                      className="!mt-3 flex gap-3 text-sm z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="text-blue-600 hover:!underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:!underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))
              .reverse()
          )}
        </div>
      )}
    </div>
  );
}
