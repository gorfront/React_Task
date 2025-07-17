"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
  };

  return (
    <nav className="bg-gray-800 text-white !px-6 !py-3 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Link href="/dashboard" className="hover:!underline">
          Dashboard
        </Link>
        {user && (
          <>
            <Link href="/dashboard/create" className="hover:!underline">
              Add new product
            </Link>
            <Link href="/profile" className="hover:!underline">
              My profile
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="hover:!underline cursor-pointer"
          >
            Sign out
          </button>
        ) : (
          <>
            <Link href="/signup" className="!p-2 hover:!underline">
              Sign up
            </Link>
            <Link href="/signin" className="!p-2 hover:!underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
