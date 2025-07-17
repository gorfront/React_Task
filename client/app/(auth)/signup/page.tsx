"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signup } from "@/features/auth/authSlice";
import AddPhoto from "@/components/AddPhoto";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: undefined as string | undefined,
    birthDay: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    avatar: "",
    birthDay: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      avatar: "",
      birthDay: "",
    };

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(signup(form));
    if (signup.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md !mx-auto !p-6 !mt-10 bg-white rounded-xl shadow-md border border-gray-200">
      <h1 className="text-3xl font-bold !mb-6 text-center text-blue-700">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          className="input"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          type="password"
          required
          className="input"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <AddPhoto
          setPhoto={(url: any) => setForm((prev) => ({ ...prev, avatar: url }))}
        />
        {errors.avatar && (
          <p className="text-red-500 text-sm">{errors.avatar}</p>
        )}

        <input
          name="birthDay"
          type="date"
          value={form.birthDay}
          onChange={handleChange}
          className="input"
        />
        {errors.birthDay && (
          <p className="text-red-500 text-sm">{errors.birthDay}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white !py-2 !px-4 rounded-md font-semibold cursor-pointer"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
