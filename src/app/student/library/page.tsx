"use client";

import { useState } from "react";
import { Search, Filter, Star, BookOpen } from "lucide-react";

// Book data interface
interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  pages: number;
  status: "Available" | "Borrowed" | "Overdue";
  image: string;
}

// Sample books data
const booksData: Book[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Technology",
    rating: 4.8,
    pages: 1312,
    status: "Borrowed",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=280&fit=crop"
  },
  {
    id: "2", 
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    rating: 4.7,
    pages: 256,
    status: "Available",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop"
  },
  {
    id: "3",
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    category: "Mathematics",
    rating: 4.5,
    pages: 1368,
    status: "Overdue",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=280&fit=crop"
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Literature",
    rating: 4.9,
    pages: 324,
    status: "Available",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop"
  },
  {
    id: "5",
    title: "World History: Patterns of Interaction",
    author: "Roger B. Beck",
    category: "History",
    rating: 4.3,
    pages: 1120,
    status: "Borrowed",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=280&fit=crop"
  },
  {
    id: "6",
    title: "The Art of Computer Programming",
    author: "Donald Knuth",
    category: "Technology",
    rating: 4.9,
    pages: 672,
    status: "Borrowed",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop"
  },
  {
    id: "7",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Technology",
    rating: 4.8,
    pages: 1312,
    status: "Borrowed",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=280&fit=crop"
  },
  {
    id: "8",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    rating: 4.7,
    pages: 256,
    status: "Borrowed",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop"
  }
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"Borrowed Books" | "Pending books" | "History">("Borrowed Books");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter books based on active tab and search
  const filteredBooks = booksData.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === "Borrowed Books") {
      matchesTab = book.status === "Borrowed" || book.status === "Overdue";
    } else if (activeTab === "Pending books") {
      matchesTab = book.status === "Available";
    }
    // For History tab, show all books
    
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium absolute top-3 left-3";
    
    switch (status) {
      case "Available":
        return `${baseClasses} bg-green-500 text-white`;
      case "Borrowed":
        return `${baseClasses} bg-green-500 text-white`;
      case "Overdue":
        return `${baseClasses} bg-red-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Available":
        return "Available";
      case "Borrowed":
        return "Borrowed";
      case "Overdue":
        return "Overdue";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600 mt-1">Browse and borrow books from our digital collection</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen size={16} />
          <span>5 books available</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["Borrowed Books", "Pending books", "History"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
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
        
        <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <Filter size={16} className="text-gray-400" />
          Filters
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Book Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <span className={getStatusBadge(book.status)}>
                {getStatusText(book.status)}
              </span>
              <img 
                src={book.image} 
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280' viewBox='0 0 200 280'%3E%3Crect width='200' height='280' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16'%3EBook%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Book Details */}
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{book.category}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-xs text-gray-600 mb-3">{book.author}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700">{book.rating}</span>
                </div>
                <span className="text-xs text-gray-500">{book.pages} pages</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          Previous
        </button>
        
        <button
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-2 text-sm rounded ${
            currentPage === 1
              ? "bg-black text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          1
        </button>
        
        <button
          onClick={() => setCurrentPage(2)}
          className={`px-3 py-2 text-sm rounded ${
            currentPage === 2
              ? "bg-black text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          2
        </button>
        
        <button
          onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
          disabled={currentPage === 2}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

