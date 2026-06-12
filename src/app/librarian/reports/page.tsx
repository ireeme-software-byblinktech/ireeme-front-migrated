"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    ClipboardList,
    FileText,
    Download,
    Calendar,
    BarChart,
    Users,
    TrendingUp,
    Clock,
    DollarSign,
    Book
} from "lucide-react";
import { Card, CardBody, StatCard } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { libraryApi } from "@/lib/api/library";
import { studentsApi } from "@/lib/api/students";
import { toast } from "@/lib/utils/toast";

// ─── REPORT TYPES CONFIG ──────────────────────────────────────

const reportTypes = [
    { id: 1, title: "Circulation Report", desc: "Books issued and returned statistics", icon: <BookOpen className="text-blue-600" />, color: "bg-blue-50" },
    { id: 2, title: "Overdue Books Report", desc: "List of overdue books and fines", icon: <Clock className="text-rose-600" />, color: "bg-rose-50" },
    { id: 3, title: "Member Activity Report", desc: "Member registration and activity stats", icon: <Users className="text-emerald-600" />, color: "bg-emerald-50" },
    { id: 4, title: "Collection Report", desc: "Book inventory and availability", icon: <Book className="text-purple-600" />, color: "bg-purple-50" },
    { id: 5, title: "Financial Report", desc: "Fines collected and pending", icon: <DollarSign className="text-amber-600" />, color: "bg-amber-50" },
    { id: 6, title: "Popular Books Report", desc: "Most issued and requested books", icon: <TrendingUp className="text-orange-600" />, color: "bg-orange-50" },
];

const recentReports = [
    { id: 1, name: "Monthly Circulation Report", date: "Recent Data", size: "Live Query", type: "CSV" },
    { id: 2, name: "Overdue Books Report", date: "Recent Data", size: "Live Query", type: "CSV" },
    { id: 3, name: "Member Activity Report", date: "Recent Data", size: "Live Query", type: "CSV" },
    { id: 4, name: "Collection Inventory Report", date: "Recent Data", size: "Live Query", type: "CSV" },
];

export default function LibraryReports() {
    const [reportPeriod, setReportPeriod] = useState("Month");

    // Fetch books
    const { data: booksResponse } = useQuery({
        queryKey: ["reports-books"],
        queryFn: () => libraryApi.getBooks({ limit: 1000 }),
    });

    // Fetch borrowings
    const { data: borrowingsResponse } = useQuery({
        queryKey: ["reports-borrowings"],
        queryFn: () => libraryApi.getBorrowings({ limit: 1000 }),
    });

    // Fetch students
    const { data: studentsResponse } = useQuery({
        queryKey: ["reports-students"],
        queryFn: () => studentsApi.getStudents({ limit: 1000 }),
    });

    const rawBooks = booksResponse?.data || [];
    const books = rawBooks.map(book => ({
        ...book,
        availableCopies: book.availableCopies ?? book.available ?? 0,
    }));
    const borrowings = borrowingsResponse?.data || [];
    const students = studentsResponse?.data || [];

    // Calculate stats
    const totalBooks = booksResponse?.total || books.length;
    const totalMembers = studentsResponse?.total || students.length;
    
    const activeBorrowings = borrowings.filter(b => !b.returnedAt);
    const activeBorrowingsCount = activeBorrowings.length;
    
    const overdueBorrowings = borrowings.filter(b => 
        !b.returnedAt && new Date(b.dueDate) < new Date()
    );
    const overdueBorrowingsCount = overdueBorrowings.length;

    // Helper function to download CSV
    const downloadCSV = (headers: string[], rows: string[][], filename: string) => {
        const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Report generation handler
    const handleGenerateReport = (reportId: number) => {
        let headers: string[] = [];
        let rows: string[][] = [];
        let filename = "";

        switch (reportId) {
            case 1: // Circulation Report
                headers = ["Borrowing ID", "Book Title", "Author", "ISBN", "Borrower Name", "Borrower Email", "Borrow Date", "Due Date", "Returned Date", "Status"];
                rows = borrowings.map(b => [
                    b.id,
                    b.book?.title || "N/A",
                    b.book?.author || "N/A",
                    b.book?.isbn || "N/A",
                    b.student ? `${b.student.firstName} ${b.student.lastName}` : "N/A",
                    b.student?.email || "N/A",
                    new Date(b.borrowedAt).toLocaleDateString(),
                    new Date(b.dueDate).toLocaleDateString(),
                    b.returnedAt ? new Date(b.returnedAt).toLocaleDateString() : "N/A",
                    b.returnedAt ? "Returned" : (new Date(b.dueDate) < new Date() ? "Overdue" : "Active")
                ]);
                filename = `Circulation_Report_${reportPeriod}_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            case 2: // Overdue Books Report
                headers = ["Borrowing ID", "Book Title", "Author", "Borrower Name", "Borrower Email", "Borrow Date", "Due Date", "Days Overdue", "Estimated Fine (RWF)"];
                rows = overdueBorrowings.map(b => {
                    const daysOverdue = Math.ceil((new Date().getTime() - new Date(b.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                    const fine = daysOverdue * 500; // 500 RWF per day
                    return [
                        b.id,
                        b.book?.title || "N/A",
                        b.book?.author || "N/A",
                        b.student ? `${b.student.firstName} ${b.student.lastName}` : "N/A",
                        b.student?.email || "N/A",
                        new Date(b.borrowedAt).toLocaleDateString(),
                        new Date(b.dueDate).toLocaleDateString(),
                        daysOverdue.toString(),
                        fine.toString()
                    ];
                });
                filename = `Overdue_Books_Report_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            case 3: // Member Activity Report
                headers = ["Student ID", "Student Number", "Name", "Email", "Gender", "Total Borrowed", "Active Loans", "Overdue Loans"];
                rows = students.map(s => {
                    const studentBorrowings = borrowings.filter(b => b.studentId === s.id);
                    const totalBorrowed = studentBorrowings.length;
                    const activeLoans = studentBorrowings.filter(b => !b.returnedAt).length;
                    const overdueLoans = studentBorrowings.filter(b => !b.returnedAt && new Date(b.dueDate) < new Date()).length;
                    return [
                        s.id,
                        s.studentNumber,
                        s.user ? `${s.user.firstName} ${s.user.lastName}` : "N/A",
                        s.user?.email || "N/A",
                        s.gender || "N/A",
                        totalBorrowed.toString(),
                        activeLoans.toString(),
                        overdueLoans.toString()
                    ];
                });
                filename = `Member_Activity_Report_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            case 4: // Collection Report
                headers = ["Book ID", "Title", "Author", "ISBN", "Genre", "Total Copies", "Available Copies", "Times Borrowed"];
                rows = books.map(book => {
                    const timesBorrowed = borrowings.filter(b => b.bookId === book.id).length;
                    return [
                        book.id,
                        book.title,
                        book.author,
                        book.isbn || "N/A",
                        book.genre || "General",
                        (book.totalCopies ?? 0).toString(),
                        (book.availableCopies ?? 0).toString(),
                        timesBorrowed.toString()
                    ];
                });
                filename = `Collection_Report_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            case 5: // Financial Report
                headers = ["Borrowing ID", "Book Title", "Borrower Name", "Due Date", "Returned Date", "Days Overdue", "Fine Status", "Fine Amount (RWF)"];
                rows = borrowings.filter(b => {
                    const isLateReturn = b.returnedAt && new Date(b.returnedAt) > new Date(b.dueDate);
                    const isOverdue = !b.returnedAt && new Date(b.dueDate) < new Date();
                    return isLateReturn || isOverdue;
                }).map(b => {
                    const isReturned = !!b.returnedAt;
                    const endDate = isReturned ? new Date(b.returnedAt!) : new Date();
                    const daysOverdue = Math.ceil((endDate.getTime() - new Date(b.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                    const fineAmount = daysOverdue * 500;
                    return [
                        b.id,
                        b.book?.title || "N/A",
                        b.student ? `${b.student.firstName} ${b.student.lastName}` : "N/A",
                        new Date(b.dueDate).toLocaleDateString(),
                        b.returnedAt ? new Date(b.returnedAt).toLocaleDateString() : "N/A",
                        daysOverdue.toString(),
                        isReturned ? "Collected" : "Pending",
                        fineAmount.toString()
                    ];
                });
                filename = `Financial_Fines_Report_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            case 6: // Popular Books Report
                headers = ["Rank", "Title", "Author", "Genre", "Times Borrowed", "Available Copies", "Total Copies"];
                rows = books.map(book => {
                    const timesBorrowed = borrowings.filter(b => b.bookId === book.id).length;
                    return { book, timesBorrowed };
                })
                .sort((a, b) => b.timesBorrowed - a.timesBorrowed)
                .map((item, idx) => [
                    (idx + 1).toString(),
                    item.book.title,
                    item.book.author,
                    item.book.genre || "General",
                    item.timesBorrowed.toString(),
                    (item.book.availableCopies ?? 0).toString(),
                    (item.book.totalCopies ?? 0).toString()
                ]);
                filename = `Popular_Books_Report_${new Date().toISOString().slice(0, 10)}.csv`;
                break;
            default:
                toast.error("Invalid report type selected.");
                return;
        }

        if (rows.length === 0) {
            toast.error("No records found in the database to generate this report.");
            return;
        }

        try {
            downloadCSV(headers, rows, filename);
            toast.success(`Successfully generated and downloaded ${filename}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate report file.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 pb-10"
        >
            {/* Header Section */}
            <div>
                <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Reports & Analytics</h1>
                <p className="text-gray-500 text-sm font-medium mt-1">Generate and download library reports</p>
            </div>

            {/* Period Selector */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-fit">
                <div className="flex items-center gap-2 px-3 border-r border-gray-100 mr-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Report Period:</span>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    {["Week", "Month", "Quarter", "Year"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setReportPeriod(p)}
                            className={cn(
                                "px-6 py-2 rounded-lg text-xs font-black transition-all",
                                reportPeriod === p ? "bg-black text-white shadow-md shadow-black/10 scale-105" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Books"
                    value={totalBooks.toString()}
                    icon={<BookOpen />}
                    trend={{ value: "+2.1", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Active Loans"
                    value={activeBorrowingsCount.toString()}
                    icon={<ClipboardList />}
                    trend={{ value: "+0.0", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Overdue Books"
                    value={overdueBorrowingsCount.toString()}
                    icon={<Clock />}
                    trend={{ value: "-1.2", direction: "down", label: "This month" }}
                />
                <StatCard
                    label="Total Members"
                    value={totalMembers.toString()}
                    icon={<Users />}
                    trend={{ value: "+4.5", direction: "up", label: "This month" }}
                />
            </div>

            {/* Generate Reports Grid */}
            <section className="space-y-6">
                <h2 className="text-lg font-black text-gray-900 px-1">Generate Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportTypes.map((report, i) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4 group hover:shadow-xl hover:shadow-gray-100/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", report.color)}>
                                    {report.icon}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{report.title}</h3>
                                <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">{report.desc}</p>
                            </div>
                            <Button 
                                onClick={() => handleGenerateReport(report.id)}
                                className="w-full bg-black text-white h-11 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-all"
                            >
                                <BarChart size={16} className="mr-2" /> Generate Report
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recent Reports Table */}
            <section className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-black text-gray-900">Recent Reports</h2>
                </div>
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                    {recentReports.map((report, i) => (
                        <div
                            key={report.id}
                            className={cn(
                                "p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors",
                                i !== recentReports.length - 1 && "border-b border-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{report.name}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{report.date}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{report.size}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter text-blue-500">{report.type}</span>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                onClick={() => handleGenerateReport(report.id)}
                                variant="outline" 
                                className="h-10 px-6 rounded-lg border-gray-100 font-bold text-xs text-gray-600 hover:bg-black hover:text-white transition-all"
                            >
                                <Download size={16} className="mr-2" /> Download
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}

