"use client";

import { useAppSelector } from "@/store/hooks";
import InitAuth from "./InitAuth";
import ReactLoading from "react-loading";

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const initialized = useAppSelector((s) => s.auth.initialized);

  return (
    <>
      <InitAuth />
      {!initialized ? (
        <div className="w-full h-screen flex items-center justify-center text-xl">
          <ReactLoading
            type="bubbles"
            color="#525252"
            height={100}
            width={100}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}
