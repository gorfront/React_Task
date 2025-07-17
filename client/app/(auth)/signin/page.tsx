"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/features/auth/authSlice";

export default function SigninPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });

  const validate = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!form.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Invalid email format.";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "Password is required.";
      isValid = false;
    }
    // else if (form.password.length < 6) {
    //   errors.password = "Password must be at least 6 characters.";
    //   isValid = false;
    // }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md !mx-auto !mt-10 !p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold !mb-6 text-center text-gray-800">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full !p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.email && (
            <p className="text-sm text-red-600 !mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            type="password"
            className="w-full !p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.password && (
            <p className="text-sm text-red-600 !mt-1">{formErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 transition text-white !py-3 rounded-md font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {error && (
          <p className="text-sm text-red-600 text-center !mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}
