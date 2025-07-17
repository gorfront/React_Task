"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/features/user/userSlice";
import useAuthGuard from "@/hooks/useAuthGuard";
import Image from "next/image";
import AddPhoto from "@/components/AddPhoto";

export default function ProfilePage() {
  useAuthGuard();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [avatar, setAvatar] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    avatar: undefined as string | undefined,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate || "",
        avatar: user.avatar || undefined,
      });
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;

    return (
      form.firstName !== user.firstName ||
      form.lastName !== user.lastName ||
      form.birthDate !== user.birthDate ||
      form.avatar !== user.avatar
    );
  }, [form, user]);

  const getBirthDay = (birthday: string) => {
    try {
      const formattedDate = new Date(birthday).toISOString().slice(0, 10);
      return formattedDate;
    } catch {
      return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (form.birthDate) {
      const dateValue = new Date(form.birthDate);
      const now = new Date();
      if (isNaN(dateValue.getTime())) {
        newErrors.birthDate = "Invalid date format";
      } else if (dateValue > now) {
        newErrors.birthDate = "Birth date cannot be in the future";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    if (!validateForm()) {
      return;
    }

    await dispatch(updateProfile(form));
    window.location.reload();
  };

  const resetForm = () => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate || "",
        avatar: user.avatar || undefined,
      });
      setErrors({});
      setAvatar(false);
    }
  };

  const handleClear = () => {
    resetForm();
  };

  return (
    <div className="max-w-xl !mx-auto !mt-10 bg-white shadow-md rounded-md !p-6">
      <h1 className="text-3xl font-semibold text-gray-800 !mb-6">My Profile</h1>

      {form.avatar && (
        <div className="!mb-6 flex justify-center">
          <Image
            src={form.avatar}
            alt="Profile"
            width={150}
            height={150}
            className="rounded-full shadow-md object-cover w-[150px] h-[150px]"
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className={`w-full !px-4 !py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm !mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className={`w-full !px-4 !py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            required
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm !mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <input
            name="birthDate"
            type="date"
            value={form.birthDate ? getBirthDay(form.birthDate) : ""}
            onChange={handleChange}
            className={`w-full !px-4 !py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.birthDate
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-600 text-sm !mt-1">{errors.birthDate}</p>
          )}
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-gray-600 text-sm font-medium">
            Change Photo:
          </label>
          <AddPhoto
            avatar={avatar}
            type="profile"
            setPhoto={(url: string | undefined) =>
              setForm((prev) => ({ ...prev, avatar: url }))
            }
          />
        </div>
      </div>

      {hasChanges && (
        <div className="flex gap-4 !mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 transition text-white !px-5 !py-2 rounded-md cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 transition text-white !px-5 !py-2 rounded-md cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
