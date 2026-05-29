"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2 } from "lucide-react";
import { updateTeacherSchema, UpdateTeacherInput } from "@/lib/validations/teacher";
import { teachersApi, Teacher } from "@/lib/api/teachers";
import { toast } from "@/lib/utils/toast";

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export function EditTeacherModal({ isOpen, onClose, teacher }: EditTeacherModalProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateTeacherInput>({
    resolver: zodResolver(updateTeacherSchema),
  });

  useEffect(() => {
    if (teacher) {
      setValue("firstName", teacher.user.firstName);
      setValue("lastName", teacher.user.lastName);
      setValue("phoneNumber", teacher.user.phoneNumber || "");
      setValue("department", teacher.department || "");
      setValue("qualification", teacher.qualification || "");
      setValue("avatarUrl", teacher.user.avatarUrl || "");
      setAvatarPreview(teacher.user.avatarUrl || "");
    }
  }, [teacher, setValue]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateTeacherInput) => 
      teachersApi.updateTeacher(teacher!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher updated successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update teacher");
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
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("avatarUrl", base64String);
        setAvatarPreview(base64String);
        toast.success("Image uploaded successfully");
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to upload image");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const onSubmit = (data: UpdateTeacherInput) => {
    updateMutation.mutate(data);
  };

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit Teacher</h2>
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
                {isUploading ? "Uploading..." : "Change Photo"}
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
                First Name
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
                Last Name
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
                Phone Number
              </label>
              <input
                {...register("phoneNumber")}
                type="tel"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="+250 788 000 000"
              />
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
              disabled={updateMutation.isPending || isUploading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {updateMutation.isPending ? "Updating..." : "Update Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
