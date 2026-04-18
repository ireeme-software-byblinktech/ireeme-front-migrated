"use client";

import { useState } from "react";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { EditStudentModal } from "@/components/ui/EditStudentModal";
import { DollarSign, Clock, Edit, ToggleLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Stats data array for accountant
const accountantStats = [
  {
    label: "Total Income",
    value: "30K",
    icon: <DollarSign size={18} />,
    progress: 75,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total expenses", 
    value: "30K",
    icon: <DollarSign size={18} />,
    progress: 60,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Net balance",
    value: "30K", 
    icon: <DollarSign size={18} />,
    progress: 85,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Pending payments",
    value: "30K",
    icon: <Clock size={18} />,
    progress: 45,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

// Payment data
interface Payment {
  id: string;
  studentName: string;
  studentCode: string;
  dateTime: string;
  amount: string;
  paymentStatus: "Paid" | "Pending";
}

const paymentsData: Payment[] = [
  {
    id: "1",
    studentName: "John Doe",
    studentCode: "12090857063",
    dateTime: "12-06-2025",
    amount: "30,000",
    paymentStatus: "Paid"
  },
  {
    id: "2",
    studentName: "John Doe",
    studentCode: "12090857063",
    dateTime: "12-06-2025",
    amount: "30,000",
    paymentStatus: "Paid"
  },
  {
    id: "3",
    studentName: "John Doe",
    studentCode: "12090857063",
    dateTime: "12-06-2025",
    amount: "30,000",
    paymentStatus: "Paid"
  }
];

export default function AccountantDashboard() {
  const router = useRouter();  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, value: number} | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Payment | null>(null);
  const itemsPerPage = 10;

  // Fetch current data mapping bounds if needed (mocked for visual matching here)
  
  // Pagination
  const totalPages = Math.ceil(paymentsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = paymentsData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Payment>[] = [
    {
      key: "select",
      header: "",
      width: "50px",
      render: () => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300"
        />
      )
    },
    {
      key: "studentName",
      header: "Student Name",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.studentName}</div>
      )
    },
    {
      key: "studentCode",
      header: "Student Code",
      render: (_, row) => (
        <div className="text-gray-600">{row.studentCode}</div>
      )
    },
    {
      key: "dateTime",
      header: "Date & Time",
      render: (_, row) => (
        <div className="text-gray-600">{row.dateTime}</div>
      )
    },
    {
      key: "amount",
      header: "Amount",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.amount}</div>
      )
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium inline-block min-w-[80px] text-center">
          {row.paymentStatus}
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => {
              setSelectedStudent(row);
              setIsEditModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Edit size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <ToggleLeft size={24} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="stats-grid">
        {accountantStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value.toString()}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
            onClick={() => {
              if (stat.label === "Pending payments") {
                router.push("/accountant/students");
              } else if (stat.label === "Total Income" || stat.label === "Total expenses" || stat.label === "Net balance") {
                router.push("/accountant/transactions");
              }
            }}
          />
        ))}
      </div>

      {/* Payment Chart */}
      <div>
        <Card>
        <CardHeader 
          title="Payment per month"
          action={
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              options={[
                { value: "January", label: "January" },
                { value: "February", label: "February" },
                { value: "March", label: "March" },
                { value: "April", label: "April" },
                { value: "May", label: "May" },
                { value: "June", label: "June" },
                { value: "July", label: "July" },
                { value: "August", label: "August" },
                { value: "September", label: "September" },
                { value: "October", label: "October" },
                { value: "November", label: "November" },
                { value: "December", label: "December" }
              ]}
              className="w-32"
            />
          }
        />
        <CardBody>
          <div className="h-[360px] relative mt-4 overflow-visible px-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-10 pr-0">
              {[200, 150, 100, 50, 0].map(y => (
                <div key={y} className="flex items-center gap-8">
                  <span className="text-[13px] text-gray-400 w-8 text-right font-black">{y}</span>
                  <div className="flex-1 h-[1px] bg-gray-100"></div>
                </div>
              ))}
            </div>

            {/* Months Labels - Uppercase centered per segment */}
            <div className="absolute bottom-0 left-16 right-0 flex justify-between px-0 pt-8">
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'].map(month => (
                <span key={month} className="text-[12px] text-gray-400 font-black tracking-widest uppercase w-[calc(100%/12)] text-center">{month}</span>
              ))}
            </div>

            {/* SVG Line Graph - Exact Jagged Profile from Image 2 */}
            <div className="absolute inset-0 left-16 pt-10 pb-10 pr-0">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#27272a" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#f4f4f5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M5,190 L10,180 L50,180 L80,182 L120,170 L150,120 L180,145 L220,140 L250,110 L300,180 L350,150 L400,165 L430,130 L450,105 L470,25 L490,175 L520,135 L550,150 L580,120 L620,145 L650,115 L680,125 L710,105 L730,185 L780,150 L810,155 L840,140 L880,175 L910,135 L950,120 L1000,100 L1000,200 L0,200 Z"
                  fill="url(#trendGradient)"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M5,190 L10,180 L50,180 L80,182 L120,170 L150,120 L180,145 L220,140 L250,110 L300,180 L350,150 L400,165 L430,130 L450,105 L470,25 L490,175 L520,135 L550,150 L580,120 L620,145 L650,115 L680,125 L710,105 L730,185 L780,150 L810,155 L840,140 L880,175 L910,135 L950,120 L1000,100"
                  fill="none"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots at specific points matching Image 2 profile */}
                {[5, 120, 150, 250, 300, 470, 490, 710, 730].map((x, i) => {
                  const map: Record<number, number> = {
                    5: 190, 120: 170, 150: 120, 250: 110, 300: 180, 470: 25, 490: 175, 710: 105, 730: 185
                  };
                  return <circle key={i} cx={x} cy={map[x]} r="4.5" fill="black" stroke="white" strokeWidth="2" />;
                })}
              </svg>
            </div>
          </div>
        </CardBody>
      </Card>
      </div>

      {/* Paid Students Table */}
      <div>
        <Card>
          <CardHeader title="Paid Students" />
          <CardBody>
          {/* Table */}
          <div className="mb-6">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={paginatedData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="assignments-table"
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, paymentsData.length)} of {paymentsData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
      </div>

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent ? {
          name: selectedStudent.studentName,
          code: selectedStudent.studentCode,
          parentName: "Doe Dad",
          paymentAmount: selectedStudent.amount || "30,000",
          dateTime: selectedStudent.dateTime
        } : undefined}
      />
    </div>
  );
}
