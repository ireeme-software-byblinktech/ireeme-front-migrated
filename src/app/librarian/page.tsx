"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Library,
    BookOpen,
    ClipboardList,
    Users,
    FileText,
    Search,
    Book,
    Clock,
    ArrowRight,
    User,
} from "lucide-react";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { libraryApi, Borrowing } from "@/lib/api/library";
import { studentsApi } from "@/lib/api/students";

export default function LibrarianDashboard() {
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch books
    const { data: booksResponse } = useQuery({
        queryKey: ["dashboard-books"],
        queryFn: () => libraryApi.getBooks({ limit: 100 }),
    });

    // Fetch borrowings
    const { data: borrowingsResponse } = useQuery({
        queryKey: ["dashboard-borrowings"],
        queryFn: () => libraryApi.getBorrowings({ limit: 100 }),
    });

    // Fetch students
    const { data: studentsResponse } = useQuery({
        queryKey: ["dashboard-students"],
        queryFn: () => studentsApi.getStudents({ limit: 100, isActive: true }),
    });

    const books = booksResponse?.data || [];
    const borrowings = borrowingsResponse?.data || [];
    const students = studentsResponse?.data || [];

    // Helper function for date formatting
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };

    // Calculate stats
    const totalBooks = booksResponse?.total || 0;
    const totalMembers = studentsResponse?.total || 0;
    const activeBorrowings = borrowings.filter(b => !b.returnedAt).length;
    const overdueBorrowings = borrowings.filter(b => 
        !b.returnedAt && new Date(b.dueDate) < new Date()
    ).length;

    // Recent borrowings (last 8)
    const recentBorrowings = borrowings
        .sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime())
        .slice(0, 8);

    // Upcoming returns (next 4 due dates)
    const upcomingReturns = borrowings
        .filter(b => !b.returnedAt)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 4)
        .map(b => {
            const daysLeft = Math.ceil((new Date(b.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysLeft < 0;
            return {
                id: b.id,
                title: b.book?.title || "N/A",
                borrower: b.student ? `${b.student.firstName} ${b.student.lastName}` : "N/A",
                due: formatDate(b.dueDate),
                daysLeft: isOverdue ? 'Overdue' : `${daysLeft}d`,
                color: isOverdue ? 'text-red-600 bg-red-50 border-red-100' :
                       daysLeft <= 1 ? 'text-rose-500 bg-rose-50 border-rose-100' :
                       daysLeft <= 2 ? 'text-amber-500 bg-amber-50 border-amber-100' :
                       daysLeft <= 3 ? 'text-yellow-500 bg-yellow-50 border-yellow-100' :
                       'text-orange-500 bg-orange-50 border-orange-100'
            };
        });

    // Popular books (most borrowed)
    const bookBorrowCounts = borrowings.reduce((acc, b) => {
        acc[b.bookId] = (acc[b.bookId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const popularBooks = books
        .map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.genre || "General",
            issues: bookBorrowCounts[book.id] || 0,
            available: book.availableCopies,
            total: book.totalCopies,
            color: book.availableCopies > book.totalCopies / 2 ? "bg-emerald-500" : 
                   book.availableCopies > 0 ? "bg-amber-500" : "bg-red-500"
        }))
        .sort((a, b) => b.issues - a.issues)
        .slice(0, 4);

    const borrowedCols: Column<Borrowing>[] = [
        {
            key: "bookId",
            header: "Book Cover",
            width: "80px",
            render: (v, borrowing) => (
                <div className="w-10 h-14 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm ml-2">
                    {borrowing.book?.coverUrl ? (
                        <img src={borrowing.book.coverUrl} alt={borrowing.book.title} className="w-full h-full object-cover" />
                    ) : (
                        <Book className="text-gray-300" size={20} />
                    )}
                </div>
            )
        },
        { 
            key: "bookId", 
            header: "Book Title", 
            render: (v, borrowing) => <span className="font-semibold text-gray-800 ml-4">{borrowing.book?.title || "N/A"}</span> 
        },
        { 
            key: "studentId", 
            header: "Borrower", 
            render: (v, borrowing) => (
                <span className="text-gray-600">
                    {borrowing.student ? `${borrowing.student.firstName} ${borrowing.student.lastName}` : "N/A"}
                </span>
            )
        },
        { 
            key: "borrowedAt", 
            header: "Borrow date", 
            render: (v) => <span className="text-gray-500 tabular-nums">{formatDate(String(v))}</span> 
        },
        { 
            key: "dueDate", 
            header: "Due date", 
            render: (v) => <span className="text-gray-500 tabular-nums">{formatDate(String(v))}</span> 
        },
        {
            key: "id",
            header: "Status",
            render: (v, borrowing) => {
                const isReturned = !!borrowing.returnedAt;
                const isOverdue = !isReturned && new Date(borrowing.dueDate) < new Date();
                const status = isReturned ? "Returned" : isOverdue ? "Overdue" : "Active";
                return (
                    <span className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border text-center block w-fit",
                        status === "Active" ? "bg-blue-50 text-blue-700 border-blue-100" : 
                        status === "Overdue" ? "bg-rose-50 text-rose-700 border-rose-100" :
                        "bg-emerald-50 text-emerald-700 border-emerald-100"
                    )}>
                        {status}
                    </span>
                );
            }
        }
    ];
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 pb-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-gray-50 shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Library Dashboard</h1>
                </div>
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm shadow-inner"
                    />
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Books"
                    value={totalBooks.toString()}
                    icon={<BookOpen />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Total Members"
                    value={totalMembers.toString()}
                    icon={<Users />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Active Loans"
                    value={activeBorrowings.toString()}
                    icon={<Book />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Overdue Books"
                    value={overdueBorrowings.toString()}
                    icon={<Clock />}
                    trend={{ value: "-2.1", direction: "down", label: "This month" }}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
                {/* Borrowed Books Table */}
                <div className="xl:col-span-2 space-y-4">
                    <Card className="border-none shadow-xl shadow-gray-100/50 rounded-2xl overflow-hidden bg-white">
                        <CardBody className="p-0">
                            <DataTable
                                columns={borrowedCols}
                                data={recentBorrowings}
                                keyField="id"
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* Upcoming Returns List */}
                <Card className="border-none shadow-xl shadow-gray-100/50 rounded-2xl bg-white p-2 h-fit">
                    <CardHeader title="Upcoming Returns" className="p-6 pb-2 border-none" />
                    <CardBody className="space-y-4 p-6 pt-2">
                        {upcomingReturns.length > 0 ? (
                            upcomingReturns.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all border border-transparent hover:border-gray-100 group cursor-pointer"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Clock size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-black text-gray-900">{item.title}</h4>
                                        <p className="text-[11px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors mt-0.5">{item.borrower}</p>
                                        <p className="text-[10px] text-gray-400/80 mt-1 font-bold uppercase tracking-tighter">Due: {item.due}</p>
                                    </div>
                                    <div className={cn("px-2.5 py-1.5 rounded-lg text-[10px] font-black border tracking-tighter", item.color)}>
                                        {item.daysLeft}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="text-gray-300 mb-3" size={36} />
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Upcoming Returns</p>
                                <p className="text-xs text-gray-400 mt-1">All borrowed books have been returned.</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Popular Books Section */}
            <section className="space-y-6 pt-6">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Popular Books</h2>
                    <Link href="/librarian/books" className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularBooks.map((book, i) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 hover:shadow-xl hover:shadow-gray-100/50 transition-all cursor-pointer group"
                        >
                            <div className="space-y-1">
                                <h3 className="font-black text-gray-900 text-[15px] leading-tight group-hover:text-blue-600 transition-colors">{book.title}</h3>
                                <p className="text-[12px] text-gray-400 font-bold">{book.author}</p>
                            </div>

                            <div className="inline-block px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                                {book.category}
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Issues: {book.issues}</span>
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", book.available < 5 ? "text-rose-500" : "text-emerald-500")}>
                                        {book.available}/{book.total} Available
                                    </span>
                                </div>
                                <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(book.available / book.total) * 100}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                                        className={cn("h-full rounded-full shadow-inner", book.color)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}
