"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

type AddPhotoProps = {
  setPhoto: any;
  type?: string;
  avatar?: boolean;
};

const AddPhoto = ({ setPhoto, type, avatar }: AddPhotoProps) => {
  const user = useAppSelector((s) => s.auth.user);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  console.log({ avatar });

  useEffect(() => {
    if (!avatar) {
      setFile(null);
      setPreviewUrl(null);
    } else {
    }
  }, [avatar]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    return () => {
      URL.revokeObjectURL(localUrl);
    };
  }, [file]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      setFile(selectedFile);

      try {
        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("avatar", selectedFile);

        const response = await axios.post(
          "http://localhost:5000/api/upload/upload-avatar",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percent);
              }
            },
          }
        );

        setPhoto(response.data.avatarUrl);
      } catch (error) {
        alert("Upload error");
        setFile(null);
        setPhoto(undefined);
      } finally {
        setUploading(false);
      }
    },
    [setPhoto]
  );

  const handleDelete = () => {
    setFile(null);
    if (!file) {
      return;
    }
    setPhoto(type === "profile" ? user?.avatar : "");
  };

  return (
    <div>
      {!previewUrl && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="mb-2"
        />
      )}

      {uploading && (
        <div className="w-full bg-gray-300 rounded h-2 !mb-2">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {previewUrl && (
        <div className="relative w-28 h-28">
          <Image
            src={previewUrl}
            alt="uploaded"
            className="w-full h-full object-cover rounded"
            width={28}
            height={28}
          />
          <button
            onClick={handleDelete}
            className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPhoto;
