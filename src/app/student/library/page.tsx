"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Star, BookOpen } from "lucide-react";
import { useBooks, useStudentBorrowings } from "@/hooks/api/useLibrary";
import { useStudentProfile } from "@/hooks/api/useStudentAPI";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"Borrowed Books" | "Available Books" | "All Books">("Borrowed Books");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: profile } = useStudentProfile();
  const { data: booksData, isLoading: booksLoading } = useBooks({ 
    search: searchTerm,
    category: selectedCategory || undefined,
    page: currentPage,
    limit: 12
  });
  const { data: borrowings, isLoading: borrowingsLoading } = useStudentBorrowings(profile?.id);

  const isLoading = booksLoading || borrowingsLoading;

  // Map borrowings to book IDs for status checking
  const borrowedBookIds = useMemo(() => {
    if (!borrowings) return new Set<string>();
    return new Set(
      borrowings
        .filter(b => b.status === "BORROWED" || b.status === "OVERDUE")
        .map(b => b.bookId)
    );
  }, [borrowings]);

  // Filter books based on active tab
  const filteredBooks = useMemo(() => {
    if (!booksData?.data) return [];
    
    if (activeTab === "Borrowed Books") {
      return booksData.data.filter(book => borrowedBookIds.has(book.id));
    } else if (activeTab === "Available Books") {
      return booksData.data.filter(book => book.availableQuantity > 0);
    }
    return booksData.data;
  }, [booksData, activeTab, borrowedBookIds]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!booksData?.data) return [];
    return Array.from(new Set(booksData.data.map(b => b.category))).filter(Boolean);
  }, [booksData]);

  if (isLoading && !booksData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const getBookStatus = (book: any) => {
    if (borrowedBookIds.has(book.id)) {
      const borrowing = borrowings?.find(b => b.bookId === book.id && b.status !== "RETURNED");
      if (borrowing?.status === "OVERDUE") return "Overdue";
      return "Borrowed";
    }
    return book.availableQuantity > 0 ? "Available" : "Unavailable";
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium absolute top-3 left-3";
    
    switch (status) {
      case "Available":
        return `${baseClasses} bg-green-500 text-white`;
      case "Borrowed":
        return `${baseClasses} bg-blue-500 text-white`;
      case "Overdue":
        return `${baseClasses} bg-red-500 text-white`;
      case "Unavailable":
        return `${baseClasses} bg-gray-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  const availableBooksCount = booksData?.data.filter(b => b.availableQuantity > 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600 mt-1">Browse and borrow books from our collection</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen size={16} />
          <span>{availableBooksCount} books available</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["Borrowed Books", "Available Books", "All Books"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab} {tab === "Borrowed Books" && borrowings && `(${borrowings.filter(b => b.status === "BORROWED" || b.status === "OVERDUE").length})`}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const status = getBookStatus(book);
            return (
              <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Book Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <span className={getStatusBadge(status)}>
                    {status}
                  </span>
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280' viewBox='0 0 200 280'%3E%3Crect width='200' height='280' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16'%3EBook%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <BookOpen size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{book.category}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{book.author}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Available: {book.availableQuantity}/{book.quantity}</span>
                    </div>
                    {book.publishedYear && (
                      <span className="text-xs text-gray-500">{book.publishedYear}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {booksData && booksData.total > booksData.limit && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.ceil(booksData.total / booksData.limit) }, (_, i) => i + 1)
            .filter(page => {
              const totalPages = Math.ceil(booksData.total / booksData.limit);
              return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
            })
            .map((page, index, arr) => (
              <>
                {index > 0 && arr[index - 1] !== page - 1 && (
                  <span key={`ellipsis-${page}`} className="px-2 text-gray-400">...</span>
                )}
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm rounded ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {page}
                </button>
              </>
            ))}
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= Math.ceil(booksData.total / booksData.limit)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

