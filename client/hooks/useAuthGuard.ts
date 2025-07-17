"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../store/hooks";

export default function useAuthGuard() {
  const { user, initialized } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.push("/signin");
    }
  }, [user, initialized, router]);
}
