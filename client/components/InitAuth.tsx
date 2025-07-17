"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { loadUserFromToken } from "@/features/auth/authSlice";

export default function InitAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return null;
}
