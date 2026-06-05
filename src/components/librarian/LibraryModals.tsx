"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Loader2, Book as BookIcon, User, Calendar } from "lucide-react";
import { z } from "zod";
import { libraryApi, Book, CreateBookDto, UpdateBookDto } from "@/lib/api/library";
import { toast } from "@/lib/utils/toast";
import { compressImage } from "@/lib/utils/imageCompression";

// ─── Validation Schemas ───────────────────────────────────────────────────

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().optional(),
  genre: z.string().optional(),
  totalCopies: z.number().min(1, "Must have at least 1 copy"),
  coverUrl: z.string().optional(),
});

const updateBookSchema = createBookSchema.partial();

type CreateBookInput = z.infer<typeof createBookSchema>;
type UpdateBookInput = z.infer<typeof updateBookSchema>;

// ─── Add Book Modal ───────────────────────────────────────────────────────

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      totalCopies: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: libraryApi.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book added successfully");
      reset();
      setCoverPreview("");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add book");
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
      const base64String = await compressImage(file);
      setValue("coverUrl", base64String);
      setCoverPreview(base64String);
      toast.success("Cover image uploaded");
      setIsUploading(false);
    } catch (error) {
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const onSubmit = (data: CreateBookInput) => {
    createMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Cover Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-44 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <BookIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="cursor-pointer">
              <span className="text-sm font-medium text-blue-600 hover:underline">
                {isUploading ? "Uploading..." : "Upload Book Cover"}
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

          {/* Book Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                {...register("author")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                {...register("isbn")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <input
                {...register("genre")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="e.g., Fiction, Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Copies *
              </label>
              <input
                {...register("totalCopies", { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="1"
              />
              {errors.totalCopies && (
                <p className="text-red-500 text-xs mt-1">{errors.totalCopies.message}</p>
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
              {createMutation.isPending ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Book Modal ──────────────────────────────────────────────────────

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export function EditBookModal({ isOpen, onClose, book }: EditBookModalProps) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateBookInput>({
    resolver: zodResolver(updateBookSchema),
  });

  useEffect(() => {
    if (book) {
      setValue("title", book.title);
      setValue("author", book.author);
      setValue("isbn", book.isbn || "");
      setValue("genre", book.genre || "");
      setValue("totalCopies", book.totalCopies);
      setValue("coverUrl", book.coverUrl || "");
      setCoverPreview(book.coverUrl || "");
    }
  }, [book, setValue]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateBookInput) => libraryApi.updateBook(book!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book updated successfully");
      reset();
      setCoverPreview("");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update book");
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
      const base64String = await compressImage(file);
      setValue("coverUrl", base64String);
      setCoverPreview(base64String);
      toast.success("Cover image uploaded");
      setIsUploading(false);
    } catch (error) {
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const onSubmit = (data: UpdateBookInput) => {
    updateMutation.mutate(data);
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Cover Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-44 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <BookIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="cursor-pointer">
              <span className="text-sm font-medium text-blue-600 hover:underline">
                {isUploading ? "Uploading..." : "Change Book Cover"}
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

          {/* Book Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Title
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                {...register("author")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                {...register("isbn")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <input
                {...register("genre")}
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="e.g., Fiction, Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Copies
              </label>
              <input
                {...register("totalCopies", { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="1"
              />
              {errors.totalCopies && (
                <p className="text-red-500 text-xs mt-1">{errors.totalCopies.message}</p>
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
              disabled={updateMutation.isPending || isUploading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {updateMutation.isPending ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Book Modal ────────────────────────────────────────────────────

interface DeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export function DeleteBookModal({ isOpen, onClose, book }: DeleteBookModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => libraryApi.deleteBook(book!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book deleted successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete book");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Book</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold">{book.title}</span>? This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

