"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search, Filter, Users, Eye, Edit, Trash2, Plus } from "lucide-react";
import { EditStockModal, AddStockModal, ViewStockModal, DeleteStockModal } from "@/components/ui";

// Stock stats data
const stockStats = [
  {
    label: "Today's Appoints",
    value: "308",
    icon: <Users size={18} />,
    progress: 75,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  },
  {
    label: "Confirmed", 
    value: "308",
    icon: <Users size={18} />,
    progress: 60,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  },
  {
    label: "Pending",
    value: "308", 
    icon: <Users size={18} />,
    progress: 85,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  },
  {
    label: "Cancelled",
    value: "308",
    icon: <Users size={18} />,
    progress: 45,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  }
];

// Stock data interface
interface StockItem {
  id: string;
  itemName: string;
  type: string;
  quantity: string;
  expiryDate: string;
  status: "In Stock" | "Out of Stock" | "Low Stock";
}

// Sample stock data
const stockData: StockItem[] = [
  {
    id: "1",
    itemName: "Paracetamol",
    type: "Tablet",
    quantity: "500 tablets",
    expiryDate: "02-02-2026",
    status: "In Stock"
  },
  {
    id: "2",
    itemName: "Ibuprofen",
    type: "Tablet",
    quantity: "500 tablets",
    expiryDate: "02-02-2026",
    status: "In Stock"
  },
  {
    id: "3",
    itemName: "Paracetamol",
    type: "Tablet",
    quantity: "500 tablets",
    expiryDate: "02-02-2026",
    status: "In Stock"
  },
  {
    id: "4",
    itemName: "Paracetamol",
    type: "Tablet",
    quantity: "500 tablets",
    expiryDate: "02-02-2026",
    status: "In Stock"
  },
  {
    id: "5",
    itemName: "Paracetamol",
    type: "Tablet",
    quantity: "500 tablets",
    expiryDate: "02-02-2026",
    status: "In Stock"
  },
  {
    id: "6",
    itemName: "Paracetamol",
    type: "Tablet",
    quantity: "500 tablets",
    expiryDate: "02-02-2026",
    status: "In Stock"
  }
];

export default function AccountantStockPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dispenseFilter, setDispenseFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
  const itemsPerPage = 10;

  // Filter data based on search and filters
  const filteredData = stockData.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDispense = dispenseFilter === "all" || item.status.toLowerCase().includes(dispenseFilter.toLowerCase());
    return matchesSearch && matchesDispense;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<StockItem>[] = [
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
      key: "itemName",
      header: "Item Name",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.itemName}</div>
      )
    },
    {
      key: "type",
      header: "Type",
      render: (_, row) => (
        <div className="text-gray-600">{row.type}</div>
      )
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (_, row) => (
        <div className="text-gray-600">{row.quantity}</div>
      )
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      render: (_, row) => (
        <div className="text-gray-600">{row.expiryDate}</div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium inline-block min-w-[80px] text-center">
          {row.status}
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
              setSelectedStockItem(row);
              setIsViewModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => {
              setSelectedStockItem(row);
              setIsEditModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => {
              setSelectedStockItem(row);
              setIsDeleteModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="stats-grid">
        {stockStats.map((stat, index) => (
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
              <div className="text-[10px] text-gray-600 mb-1">
                <span>● Male (61%) ● Female (39%)</span>
              </div>
              <div className="stat-card-number-row">
                <p className="stat-card-number-small">{stat.value}</p>
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
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]">
            <Filter size={16} className="text-gray-400" />
            <select
              value={dispenseFilter}
              onChange={(e) => setDispenseFilter(e.target.value)}
              className="outline-none text-sm bg-transparent"
            >
              <option value="all">Dispense</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
              <option value="low">Low Stock</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Stock Table */}
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

          {/* Recently Brought Section */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Recently Brought</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium text-gray-900">John Doe</div>
                <div className="text-sm text-gray-600">Paracetamol •</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* All Stock Modals */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ViewStockModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedStockItem(null);
        }}
        stockItem={selectedStockItem ? {
          itemName: selectedStockItem.itemName,
          type: selectedStockItem.type,
          quantity: selectedStockItem.quantity,
          expiryDate: selectedStockItem.expiryDate,
          status: selectedStockItem.status
        } : undefined}
      />

      <EditStockModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStockItem(null);
        }}
        stockItem={selectedStockItem ? {
          itemName: selectedStockItem.itemName,
          type: selectedStockItem.type,
          quantity: selectedStockItem.quantity,
          expiryDate: selectedStockItem.expiryDate,
          status: selectedStockItem.status
        } : undefined}
      />

      <DeleteStockModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStockItem(null);
        }}
        stockItem={selectedStockItem ? {
          itemName: selectedStockItem.itemName,
          type: selectedStockItem.type,
          quantity: selectedStockItem.quantity,
          expiryDate: selectedStockItem.expiryDate,
          status: selectedStockItem.status
        } : undefined}
      />
    </div>
  );
}