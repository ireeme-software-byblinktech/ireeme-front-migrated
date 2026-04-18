"use client";

import { useState } from "react";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { DollarSign, Clock, Edit, ToggleLeft } from "lucide-react";

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

// Chart data for different months - with realistic jagged patterns and actual values
const chartData = {
  January: [
    { x: 0, y: 240, value: 23500 }, { x: 83, y: 220, value: 28000 }, { x: 166, y: 200, value: 32000 }, 
    { x: 249, y: 180, value: 38000 }, { x: 332, y: 160, value: 42000 }, { x: 415, y: 140, value: 48000 }, 
    { x: 498, y: 120, value: 52000 }, { x: 581, y: 100, value: 58000 }, { x: 664, y: 80, value: 62000 }, 
    { x: 747, y: 60, value: 68000 }, { x: 830, y: 40, value: 74000 }, { x: 913, y: 80, value: 61000 },
    { x: 1000, y: 100, value: 57000 }
  ],
  February: [
    { x: 0, y: 220, value: 28000 }, { x: 83, y: 200, value: 32000 }, { x: 166, y: 180, value: 38000 }, 
    { x: 249, y: 160, value: 42000 }, { x: 332, y: 140, value: 48000 }, { x: 415, y: 120, value: 52000 }, 
    { x: 498, y: 100, value: 58000 }, { x: 581, y: 80, value: 62000 }, { x: 664, y: 60, value: 68000 }, 
    { x: 747, y: 40, value: 74000 }, { x: 830, y: 80, value: 61000 }, { x: 913, y: 100, value: 57000 },
    { x: 1000, y: 120, value: 53000 }
  ],
  March: [
    { x: 0, y: 200, value: 32000 }, { x: 83, y: 180, value: 38000 }, { x: 166, y: 160, value: 42000 }, 
    { x: 249, y: 140, value: 48000 }, { x: 332, y: 120, value: 52000 }, { x: 415, y: 100, value: 58000 }, 
    { x: 498, y: 80, value: 62000 }, { x: 581, y: 60, value: 68000 }, { x: 664, y: 40, value: 74000 }, 
    { x: 747, y: 80, value: 61000 }, { x: 830, y: 100, value: 57000 }, { x: 913, y: 120, value: 53000 },
    { x: 1000, value: 49000, y: 140 }
  ],
  April: [
    { x: 0, y: 260, value: 18000 }, { x: 83, y: 240, value: 23000 }, { x: 166, y: 220, value: 28000 }, 
    { x: 249, y: 200, value: 32000 }, { x: 332, y: 180, value: 38000 }, { x: 415, y: 160, value: 42000 }, 
    { x: 498, y: 140, value: 48000 }, { x: 581, y: 120, value: 52000 }, { x: 664, y: 100, value: 58000 }, 
    { x: 747, y: 80, value: 62000 }, { x: 830, y: 60, value: 68000 }, { x: 913, y: 40, value: 74000 },
    { x: 1000, y: 80, value: 61000 }
  ],
  May: [
    { x: 0, y: 240, value: 23500 }, { x: 83, y: 200, value: 32000 }, { x: 166, y: 180, value: 38000 }, 
    { x: 249, y: 160, value: 42000 }, { x: 332, y: 140, value: 48000 }, { x: 415, y: 120, value: 52000 }, 
    { x: 498, y: 100, value: 58000 }, { x: 581, y: 80, value: 62000 }, { x: 664, y: 60, value: 68000 }, 
    { x: 747, y: 40, value: 74000 }, { x: 830, y: 80, value: 61000 }, { x: 913, y: 120, value: 53000 },
    { x: 1000, y: 140, value: 49000 }
  ],
  June: [
    { x: 0, y: 220, value: 28000 }, { x: 83, y: 180, value: 38000 }, { x: 166, y: 160, value: 42000 }, 
    { x: 249, y: 140, value: 48000 }, { x: 332, y: 120, value: 52000 }, { x: 415, y: 100, value: 58000 }, 
    { x: 498, y: 80, value: 62000 }, { x: 581, y: 60, value: 68000 }, { x: 664, y: 40, value: 74000 }, 
    { x: 747, y: 80, value: 61000 }, { x: 830, y: 120, value: 53000 }, { x: 913, y: 140, value: 49000 },
    { x: 1000, y: 160, value: 45000 }
  ],
  July: [
    { x: 0, y: 200, value: 32000 }, { x: 83, y: 160, value: 42000 }, { x: 166, y: 140, value: 48000 }, 
    { x: 249, y: 120, value: 52000 }, { x: 332, y: 100, value: 58000 }, { x: 415, y: 80, value: 62000 }, 
    { x: 498, y: 60, value: 68000 }, { x: 581, y: 40, value: 74000 }, { x: 664, y: 80, value: 61000 }, 
    { x: 747, y: 120, value: 53000 }, { x: 830, y: 140, value: 49000 }, { x: 913, y: 160, value: 45000 },
    { x: 1000, y: 180, value: 41000 }
  ],
  August: [
    { x: 0, y: 260, value: 18000 }, { x: 83, y: 220, value: 28000 }, { x: 166, y: 200, value: 32000 }, 
    { x: 249, y: 180, value: 38000 }, { x: 332, y: 160, value: 42000 }, { x: 415, y: 140, value: 48000 }, 
    { x: 498, y: 120, value: 52000 }, { x: 581, y: 100, value: 58000 }, { x: 664, y: 80, value: 62000 }, 
    { x: 747, y: 60, value: 68000 }, { x: 830, y: 40, value: 74000 }, { x: 913, y: 80, value: 61000 },
    { x: 1000, y: 120, value: 53000 }
  ],
  September: [
    { x: 0, y: 240, value: 23500 }, { x: 83, y: 200, value: 32000 }, { x: 166, y: 160, value: 42000 }, 
    { x: 249, y: 140, value: 48000 }, { x: 332, y: 120, value: 52000 }, { x: 415, y: 100, value: 58000 }, 
    { x: 498, y: 80, value: 62000 }, { x: 581, y: 60, value: 68000 }, { x: 664, y: 40, value: 74000 }, 
    { x: 747, y: 80, value: 61000 }, { x: 830, y: 120, value: 53000 }, { x: 913, y: 160, value: 45000 },
    { x: 1000, y: 180, value: 41000 }
  ],
  October: [
    { x: 0, y: 240, value: 23500 }, { x: 83, y: 220, value: 28000 }, { x: 166, y: 180, value: 38000 }, 
    { x: 249, y: 160, value: 42000 }, { x: 332, y: 140, value: 48000 }, { x: 415, y: 120, value: 52000 }, 
    { x: 498, y: 100, value: 58000 }, { x: 581, y: 80, value: 62000 }, { x: 664, y: 60, value: 68000 }, 
    { x: 747, y: 40, value: 74000 }, { x: 830, y: 80, value: 61000 }, { x: 913, y: 120, value: 53000 },
    { x: 1000, y: 140, value: 49000 }
  ],
  November: [
    { x: 0, y: 220, value: 28000 }, { x: 83, y: 200, value: 32000 }, { x: 166, y: 160, value: 42000 }, 
    { x: 249, y: 140, value: 48000 }, { x: 332, y: 120, value: 52000 }, { x: 415, y: 100, value: 58000 }, 
    { x: 498, y: 80, value: 62000 }, { x: 581, y: 60, value: 68000 }, { x: 664, y: 40, value: 74000 }, 
    { x: 747, y: 80, value: 61000 }, { x: 830, y: 120, value: 53000 }, { x: 913, y: 140, value: 49000 },
    { x: 1000, y: 160, value: 45000 }
  ],
  December: [
    { x: 0, y: 200, value: 32000 }, { x: 83, y: 180, value: 38000 }, { x: 166, y: 140, value: 48000 }, 
    { x: 249, y: 120, value: 52000 }, { x: 332, y: 100, value: 58000 }, { x: 415, y: 80, value: 62000 }, 
    { x: 498, y: 60, value: 68000 }, { x: 581, y: 40, value: 74000 }, { x: 664, y: 80, value: 61000 }, 
    { x: 747, y: 120, value: 53000 }, { x: 830, y: 140, value: 49000 }, { x: 913, y: 160, value: 45000 },
    { x: 1000, y: 180, value: 41000 }
  ]
};

export default function AccountantDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, value: number} | null>(null);
  const itemsPerPage = 10;

  // Get current month's data
  const currentData = chartData[selectedMonth as keyof typeof chartData] || chartData.October;
  
  // Find the highest point for tooltip
  const highestPoint = currentData.reduce((max, point) => point.y < max.y ? point : max, currentData[0]);

  // Create path strings for jagged lines with sharp angles
  const createPath = (points: typeof currentData) => {
    return points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
  };

  const createAreaPath = (points: typeof currentData) => {
    const linePath = createPath(points);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    return `${linePath} L ${lastPoint.x} 300 L ${firstPoint.x} 300 Z`;
  };

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
      render: () => (
        <div className="flex items-center justify-center gap-2">
          <button className="text-gray-600 hover:text-gray-900 p-2">
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
          />
        ))}
      </div>

      {/* Payment Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-900">Payment per month</h2>
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
          </div>
        </CardHeader>
        <CardBody>
          <div className="relative h-80 w-full">
            {/* Chart Container */}
            <div className="absolute inset-0 flex flex-col">
              {/* Y-axis labels */}
              <div className="flex-1 flex flex-col justify-between py-4">
                <div className="text-xs text-gray-500">100%</div>
                <div className="text-xs text-gray-500">80%</div>
                <div className="text-xs text-gray-500">60%</div>
                <div className="text-xs text-gray-500">40%</div>
                <div className="text-xs text-gray-500">20%</div>
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="ml-8 h-full relative">
              <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                {/* Background grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 60" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Chart line and area */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                
                {/* Area under the curve */}
                <path
                  d={createAreaPath(currentData)}
                  fill="url(#areaGradient)"
                />
                
                {/* Main line - jagged with sharp angles, not curved */}
                <path
                  d={createPath(currentData)}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinejoin="miter"
                  strokeLinecap="square"
                />
                
                {/* Interactive data points */}
                {currentData.map((point, index) => (
                  <circle 
                    key={index}
                    cx={point.x} 
                    cy={point.y} 
                    r="4" 
                    fill="#000000"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
                
                {/* Dynamic tooltip for hovered point */}
                {hoveredPoint && (
                  <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y - 25})`}>
                    <rect x="-35" y="-18" width="70" height="24" fill="#000000" rx="4"/>
                    <text x="0" y="-2" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                      ${hoveredPoint.value.toLocaleString()}
                    </text>
                  </g>
                )}
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                <span>5k</span>
                <span>10k</span>
                <span>15k</span>
                <span>20k</span>
                <span>25k</span>
                <span>30k</span>
                <span>35k</span>
                <span>40k</span>
                <span>45k</span>
                <span>50k</span>
                <span>55k</span>
                <span>60k</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Paid Students Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Paid Students</h2>
        </CardHeader>
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
  );
}
