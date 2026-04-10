"use client";

import { motion } from "framer-motion";
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
    StickyNote
} from "lucide-react";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const borrowedBooks = [
    { id: 1, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
    { id: 2, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
    { id: 3, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
    { id: 4, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
    { id: 5, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
    { id: 6, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
    { id: 7, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
    { id: 8, cover: "/books/book1.jpg", title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025" },
];

type BorrowedBook = typeof borrowedBooks[number];

const borrowedCols: Column<BorrowedBook>[] = [
    {
        key: "cover",
        header: "Book Cover",
        width: "80px",
        render: () => (
            <div className="w-10 h-14 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm ml-2">
                <Book className="text-gray-300" size={20} />
            </div>
        )
    },
    { key: "title", header: "Book Title", render: (v) => <span className="font-semibold text-gray-800 ml-4">{String(v)}</span> },
    { key: "borrower", header: "Borrower", render: (v) => <span className="text-gray-600">{String(v)}</span> },
    { key: "borrowDate", header: "Borrow date", render: (v) => <span className="text-gray-500 tabular-nums">{String(v)}</span> },
    { key: "returnDate", header: "Return date", render: (v) => <span className="text-gray-500 tabular-nums">{String(v)}</span> },
];

const upcomingReturns = [
    { id: 1, title: "Animal Farm", borrower: "Alex Turner", due: "3/18/2024", daysLeft: "1d", color: "text-rose-500 bg-rose-50 border-rose-100" },
    { id: 2, title: "Lord of the Flies", borrower: "Daniel Lee", due: "3/17/2024", daysLeft: "2d", color: "text-amber-500 bg-amber-50 border-amber-100" },
    { id: 3, title: "Brave New World", borrower: "Daniel Lee", due: "3/18/2024", daysLeft: "3d", color: "text-yellow-500 bg-yellow-50 border-yellow-100" },
    { id: 4, title: "Fahrenheit 451", borrower: "Emily White", due: "3/19/2024", daysLeft: "4d", color: "text-orange-500 bg-orange-50 border-orange-100" },
];

const popularBooks = [
    { id: 1, title: "Harry Potter Series", author: "J.K. Rowling", category: "Fiction", issues: 155, available: 8, total: 12, color: "bg-blue-600" },
    { id: 2, title: "The Hunger Games", author: "Suzanne Collins", category: "Fiction", issues: 134, available: 5, total: 10, color: "bg-indigo-600" },
    { id: 3, title: "Physics Fundamentals", author: "Dr. Robert Smith", category: "Science", issues: 98, available: 15, total: 20, color: "bg-blue-500" },
    { id: 4, title: "World History", author: "Prof. Jane Miller", category: "History", issues: 87, available: 12, total: 18, color: "bg-blue-700" },
];

export default function LibrarianDashboard() {
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
                    label="Total Subjects"
                    value="15"
                    icon={<BookOpen />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Total Assignments"
                    value="30"
                    icon={<ClipboardList />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Total Notes"
                    value="30"
                    icon={<StickyNote />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Total reports"
                    value="30"
                    icon={<FileText />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
                {/* Borrowed Books Table */}
                <div className="xl:col-span-2 space-y-4">
                    <Card className="border-none shadow-xl shadow-gray-100/50 rounded-2xl overflow-hidden bg-white">
                        <CardBody className="p-0">
                            <DataTable
                                columns={borrowedCols}
                                data={borrowedBooks}
                                keyField="id"
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* Upcoming Returns List */}
                <Card className="border-none shadow-xl shadow-gray-100/50 rounded-2xl bg-white p-2 h-fit">
                    <CardHeader title="Upcoming Returns" className="p-6 pb-2 border-none" />
                    <CardBody className="space-y-4 p-6 pt-2">
                        {upcomingReturns.map((item, i) => (
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
                        ))}
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
