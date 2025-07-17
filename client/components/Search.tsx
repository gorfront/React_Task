"use client";

import { useRouter } from "next/navigation";

export default function SearchInput({
  value,
  setValue,
}: {
  value: string;
  setValue: any;
}) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?query=${encodeURIComponent(value)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2 h-11 !mb-4">
      <>
        <div className="bg-gray-200 w-full rounded-3xl flex !py-[1px]">
          <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="!h-full !w-full outline-none text-gray-400 rounded-3xl !pl-5"
          />
          <button
            type="submit"
            className="text-white text-sm !px-[26px] !py-[10px] rounded-3xl cursor-pointer"
            style={{
              background:
                "linear-gradient(to right, rgba(30, 213, 169, 1) 0%, rgba(1, 180, 228, 1) 100%)",
            }}
          >
            Search
          </button>
        </div>
      </>
    </form>
  );
}
