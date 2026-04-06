"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search, Filter, DollarSign, Clock, Edit } from "lucide-react";
import { EditTransactionModal } from "@/components/ui/EditTransactionModal";

// Transaction stats data
const transactionStats = [
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

// Transaction data interface
interface Transaction {
  id: string;
  description: string;
  sourceDestination: string;
  timestamp: string;
  amount: string;
  paymentMethod: string;
  paymentStatus: "completed" | "pending" | "failed";
}

// Sample transaction data
const transactionsData: Transaction[] = [
  {
    id: "1",
    description: "Term 1 payment",
    sourceDestination: "12090857063",
    timestamp: "12-06-2025",
    amount: "30,000",
    paymentMethod: "Umwarimu Sacco",
    paymentStatus: "completed"
  },
  {
    id: "2",
    description: "Term 1 payment",
    sourceDestination: "12090857063",
    timestamp: "12-06-2025",
    amount: "30,000",
    paymentMethod: "Umwarimu Sacco",
    paymentStatus: "completed"
  },
  {
    id: "3",
    description: "Term 1 payment",
    sourceDestination: "12090857063",
    timestamp: "12-06-2025",
    amount: "30,000",
    paymentMethod: "Umwarimu Sacco",
    paymentStatus: "completed"
  },
  {
    id: "4",
    description: "Term 1 payment",
    sourceDestination: "12090857063",
    timestamp: "12-06-2025",
    amount: "30,000",
    paymentMethod: "Umwarimu Sacco",
    paymentStatus: "completed"
  },
  {
    id: "5",
    description: "Term 1 payment",
    sourceDestination: "12090857063",
    timestamp: "12-06-2025",
    amount: "30,000",
    paymentMethod: "Umwarimu Sacco",
    paymentStatus: "completed"
  }
];

export default function AccountantTransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [termFilter, setTermFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const itemsPerPage = 10;

  // Filter data based on search and filters
  const filteredData = transactionsData.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.sourceDestination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === "all" || transaction.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();
    return matchesSearch && matchesPayment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Transaction>[] = [
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
      key: "description",
      header: "Description",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.description}</div>
      )
    },
    {
      key: "sourceDestination",
      header: "Source / Destination",
      render: (_, row) => (
        <div className="text-gray-600">{row.sourceDestination}</div>
      )
    },
    {
      key: "timestamp",
      header: "Timestamp",
      render: (_, row) => (
        <div className="text-gray-600">{row.timestamp}</div>
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
      key: "paymentMethod",
      header: "Payment method",
      render: (_, row) => (
        <div className="text-gray-600">{row.paymentMethod}</div>
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
              setSelectedTransaction(row);
              setIsEditModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Edit size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="stats-grid">
        {transactionStats.map((stat, index) => (
          <div key={index} className="stat-card-horizontal">
            <div className="stat-card-circle-small">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 35}
                  strokeDashoffset={2 * Math.PI * 35 - (stat.progress / 100) * 2 * Math.PI * 35}
                  transform="rotate(-90 40 40)"
                  className="stat-card-progress-small"
                />
              </svg>
              <div className="stat-card-icon-small">
                {stat.icon}
              </div>
            </div>
            <div className="stat-card-content-horizontal">
              <h3 className="stat-card-title-small font-bold">{stat.label}</h3>
              <div className="stat-card-number-row">
                <p className="stat-card-number-small">{stat.value}</p>
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                <span>↗{stat.trend.value} {stat.trend.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="search transactions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]">
            <Filter size={16} className="text-gray-400" />
            <select
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
              className="outline-none text-sm bg-transparent"
            >
              <option value="all">Term</option>
              <option value="term1">Term 1</option>
              <option value="term2">Term 2</option>
              <option value="term3">Term 3</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]">
            <Filter size={16} className="text-gray-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="outline-none text-sm bg-transparent"
            >
              <option value="all">payment</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
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

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction ? {
          description: selectedTransaction.description,
          sourceDestination: selectedTransaction.sourceDestination,
          timestamp: selectedTransaction.timestamp,
          amount: selectedTransaction.amount,
          paymentMethod: selectedTransaction.paymentMethod
        } : undefined}
      />
    </div>
  );
}