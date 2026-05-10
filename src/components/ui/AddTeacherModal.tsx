"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2 } from "lucide-react";
import { createTeacherSchema, CreateTeacherInput } from "@/lib/validations/teacher";
import { teachersApi } from "@/lib/api/teachers";
import { uploadToCloudinary } from "@/lib/api/client";
import { toast } from "@/lib/utils/toast";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTeacherModal({ isOpen, onClose }: AddTeacherModalProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTeacherInput>({
    resolver: zodResolver(createTeacherSchema),
  });

  const createMutation = useMutation({
    mutationFn: teachersApi.createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher created successfully");
      reset();
      setAvatarPreview("");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create teacher");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setValue("avatarUrl", url);
      setAvatarPreview(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: CreateTeacherInput) => {
    createMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Teacher</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <label className="cursor-pointer">
              <span className="text-sm font-medium text-primary hover:underline">
                {isUploading ? "Uploading..." : "Upload Photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                {...register("firstName")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                {...register("lastName")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="teacher@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                {...register("phoneNumber")}
                type="tel"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="+250 788 000 000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Number *
              </label>
              <input
                {...register("employeeNum")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="EMP001"
              />
              {errors.employeeNum && (
                <p className="text-red-500 text-xs mt-1">{errors.employeeNum.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                {...register("department")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="e.g., Science"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualification
            </label>
            <input
              {...register("qualification")}
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              placeholder="e.g., Bachelor's in Education"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || isUploading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createMutation.isPending ? "Creating..." : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
