"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, User, Book as BookIcon, Calendar, Search } from "lucide-react";
import { z } from "zod";
import { libraryApi, CreateBorrowingDto, Borrowing } from "@/lib/api/library";
import { studentsApi } from "@/lib/api/students";
import { toast } from "@/lib/utils/toast";

// ─── Validation Schemas ───────────────────────────────────────────────────

const issueBorrowingSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  bookId: z.string().min(1, "Book is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type IssueBorrowingInput = z.infer<typeof issueBorrowingSchema>;

// ─── Issue Book Modal ─────────────────────────────────────────────────────

interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IssueBookModal({ isOpen, onClose }: IssueBookModalProps) {
  const queryClient = useQueryClient();
  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IssueBorrowingInput>({
    resolver: zodResolver(issueBorrowingSchema),
    defaultValues: {
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    },
  });

  const selectedStudentId = watch("studentId");
  const selectedBookId = watch("bookId");

  // Fetch students
  const { data: studentsResponse } = useQuery({
    queryKey: ["students", studentSearch],
    queryFn: () => studentsApi.getStudents({ search: studentSearch, limit: 50, isActive: true }),
    enabled: isOpen,
  });

  // Fetch available books
  const { data: booksResponse } = useQuery({
    queryKey: ["available-books", bookSearch],
    queryFn: () => libraryApi.getBooks({ search: bookSearch, limit: 50 }),
    enabled: isOpen,
  });

  const students = studentsResponse?.data || [];
  const books = (booksResponse?.data || []).filter(book => book.availableCopies > 0);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const selectedBook = books.find(b => b.id === selectedBookId);

  const issueMutation = useMutation({
    mutationFn: libraryApi.createBorrowing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book issued successfully");
      reset();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to issue book");
    },
  });

  const onSubmit = (data: IssueBorrowingInput) => {
    issueMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Issue Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student *
            </label>
            <Controller
              name="studentId"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                      type="text"
                      placeholder="Search student by name or student number..."
                      value={selectedStudent ? `${selectedStudent.user.firstName} ${selectedStudent.user.lastName} (${selectedStudent.studentNumber})` : studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        setShowStudentDropdown(true);
                        if (selectedStudent) {
                          field.onChange("");
                        }
                      }}
                      onFocus={() => setShowStudentDropdown(true)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  
                  {showStudentDropdown && students.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {students.map((student) => (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => {
                            field.onChange(student.id);
                            setShowStudentDropdown(false);
                            setStudentSearch("");
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="font-medium text-gray-900">
                            {student.user.firstName} {student.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentNumber} {student.class && `• ${student.class.name}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
            {errors.studentId && (
              <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>
            )}
          </div>

          {/* Book Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Book *
            </label>
            <Controller
              name="bookId"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <div className="relative">
                    <BookIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                      type="text"
                      placeholder="Search book by title, author, or ISBN..."
                      value={selectedBook ? `${selectedBook.title} by ${selectedBook.author}` : bookSearch}
                      onChange={(e) => {
                        setBookSearch(e.target.value);
                        setShowBookDropdown(true);
                        if (selectedBook) {
                          field.onChange("");
                        }
                      }}
                      onFocus={() => setShowBookDropdown(true)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  
                  {showBookDropdown && books.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {books.map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => {
                            field.onChange(book.id);
                            setShowBookDropdown(false);
                            setBookSearch("");
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 flex items-center gap-3"
                        >
                          {book.coverUrl ? (
                            <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-14 bg-gray-100 rounded flex items-center justify-center">
                              <BookIcon size={20} className="text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">
                              {book.author} • {book.availableCopies} available
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showBookDropdown && books.length === 0 && bookSearch && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                      No available books found
                    </div>
                  )}
                </div>
              )}
            />
            {errors.bookId && (
              <p className="text-red-500 text-xs mt-1">{errors.bookId.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    {...field}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              )}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
            )}
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
              disabled={issueMutation.isPending}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {issueMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {issueMutation.isPending ? "Issuing..." : "Issue Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Return Book Modal ────────────────────────────────────────────────────

interface ReturnBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReturnBookModal({ isOpen, onClose }: ReturnBookModalProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedBorrowing, setSelectedBorrowing] = useState<Borrowing | null>(null);

  // Fetch active borrowings
  const { data: borrowingsResponse, isLoading, refetch } = useQuery({
    queryKey: ["active-borrowings", search],
    queryFn: () => libraryApi.getBorrowings({ status: 'ACTIVE', limit: 50 }),
    enabled: isOpen,
  });

  // Refetch when modal opens
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const borrowings = borrowingsResponse?.data || [];
  
  // Debug logging
  useEffect(() => {
    if (isOpen && borrowingsResponse) {
      console.log('Borrowings Response:', borrowingsResponse);
      console.log('Borrowings Data:', borrowings);
    }
  }, [isOpen, borrowingsResponse, borrowings]);
  
  const filteredBorrowings = borrowings.filter(b => 
    search === "" || 
    b.book?.title.toLowerCase().includes(search.toLowerCase()) ||
    b.student?.firstName.toLowerCase().includes(search.toLowerCase()) ||
    b.student?.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const returnMutation = useMutation({
    mutationFn: (id: string) => libraryApi.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book returned successfully");
      setSelectedBorrowing(null);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to return book");
    },
  });

  const handleReturn = () => {
    if (selectedBorrowing) {
      returnMutation.mutate(selectedBorrowing.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Return Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Active Borrowing
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by book title or student name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Borrowings List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading borrowings...</p>
              </div>
            ) : filteredBorrowings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="font-medium">No active borrowings found</p>
                <p className="text-sm mt-1">
                  {borrowings.length === 0 
                    ? "There are no books currently borrowed" 
                    : "No borrowings match your search"}
                </p>
              </div>
            ) : (
              filteredBorrowings.map((borrowing) => (
                <button
                  key={borrowing.id}
                  type="button"
                  onClick={() => setSelectedBorrowing(borrowing)}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedBorrowing?.id === borrowing.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {borrowing.book?.coverUrl ? (
                      <img 
                        src={borrowing.book.coverUrl} 
                        alt={borrowing.book.title} 
                        className="w-12 h-16 object-cover rounded" 
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <BookIcon size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{borrowing.book?.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Borrowed by: {borrowing.student?.firstName} {borrowing.student?.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                        {new Date(borrowing.dueDate) < new Date() && (
                          <span className="ml-2 text-red-600 font-semibold">OVERDUE</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReturn}
              disabled={!selectedBorrowing || returnMutation.isPending}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {returnMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {returnMutation.isPending ? "Returning..." : "Return Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
