"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2 } from "lucide-react";
import { updateStudentSchema, UpdateStudentInput } from "@/lib/validations/student";
import { studentsApi, Student } from "@/lib/api/students";
import { uploadToCloudinary } from "@/lib/api/client";
import { toast } from "@/lib/utils/toast";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export function EditStudentModal({ isOpen, onClose, student }: EditStudentModalProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateStudentInput>({
    resolver: zodResolver(updateStudentSchema),
  });

  useEffect(() => {
    if (student) {
      setValue("firstName", student.user.firstName);
      setValue("lastName", student.user.lastName);
      setValue("phoneNumber", student.user.phoneNumber || "");
      setValue("dateOfBirth", student.dateOfBirth || "");
      setValue("gender", student.gender as any);
      setValue("avatarUrl", student.user.avatarUrl || "");
      setAvatarPreview(student.user.avatarUrl || "");
    }
  }, [student, setValue]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateStudentInput) => 
      studentsApi.updateStudent(student!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update student");
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

  const onSubmit = (data: UpdateStudentInput) => {
    updateMutation.mutate(data);
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit Student</h2>
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
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              {...register("dateOfBirth")}
              type="date"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
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
              {updateMutation.isPending ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
