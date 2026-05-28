import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Submission } from "./types";
import { Search, ChevronDown, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentTitle?: string;
  submissions?: any[];
}

export const SubmissionsModal: React.FC<SubmissionsModalProps> = ({
  isOpen,
  onClose,
  assignmentTitle = "",
  submissions = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("ALL");
  const [selectedSubmissionRows, setSelectedSubmissionRows] = useState<number[]>([]);

  const filteredSubmissions = submissions.filter((sub) => {
    // Search
    if (searchQuery && !sub.student.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Tabs
    if (filterTab === "ALL") return true;
    if (filterTab === "Submitted")
      return sub.status === "Submitted" || sub.status === "Pending" || sub.status === "Graded";
    if (filterTab === "Graded") return sub.status === "Graded";
    if (filterTab === "Not Submitted") return sub.status === "Not Submitted";
    return true;
  });

  const toggleSubmissionRow = (id: number) => {
    setSelectedSubmissionRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAllSubmissions = () => {
    if (selectedSubmissionRows.length === filteredSubmissions.length) {
      setSelectedSubmissionRows([]);
    } else {
      setSelectedSubmissionRows(filteredSubmissions.map((s) => s.id));
    }
  };

  const columns: Column<any>[] = [
    {
      key: "select",
      header: "",
      width: "40px",
      render: (_: any, sub: any) => {
        const isSelected = selectedSubmissionRows.includes(sub.id);
        return (
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleSubmissionRow(sub.id);
            }}
          >
            <div
              className={cn(
                "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                isSelected ? "border-black bg-black" : "border-gray-300 bg-white"
              )}
            >
              {isSelected && <Check size={14} className="text-white" />}
            </div>
          </div>
        );
      },
    },
    {
      key: "student",
      header: "STUDENT",
      render: (val: any) => <span className="font-bold">{val}</span>,
    },
    {
      key: "class",
      header: "CLASS",
      render: (val: any) => <span className="class-tag-v2">{val}</span>,
    },
    {
      key: "date",
      header: "SUBMISSION DATE",
    },
    {
      key: "file",
      header: "ATTACHED FILES",
      render: (val: any) =>
        val !== "-" ? (
          <div className="file-btn-v2" style={{ display: "inline-flex" }}>
            <FileText size={14} />
            <span>{val}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (val: any) => (
        <span
          className={cn(
            "px-3 py-1 rounded-full font-medium text-xs",
            val === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : val === "Graded"
              ? "bg-green-100 text-green-700"
              : val === "Submitted"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          )}
        >
          {val}
        </span>
      ),
    },
    {
      key: "grade",
      header: "GRADE",
      render: (val: any) => <span className="font-semibold">{val || "-"}</span>,
    },
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`View Submissions - ${assignmentTitle}`}
      className="modal--premium"
      size="xl"
    >
      {/* Row 1: Select Class + Stats */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="relative" style={{ minWidth: 160 }}>
          <select
            className="form-select-v2 appearance-none pr-10 py-2.5 border-gray-300 text-sm"
            style={{ minWidth: 160 }}
          >
            <option>Select Class</option>
            <option>Year 1A</option>
            <option>Year 1B</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>

        <div
          className="flex items-center gap-4 bg-[#F3F4F6] rounded-xl px-6 py-2.5 text-sm font-medium text-gray-600 flex-1 justify-center"
          style={{ minWidth: 0 }}
        >
          <span>
            Total: <strong className="text-black font-semibold">26</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>
            Submitted: <strong className="text-black font-semibold">24</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>
            Graded: <strong className="text-black font-semibold">19</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>
            Pending: <strong className="text-black font-semibold">1</strong>
          </span>
        </div>
      </div>

      {/* Row 2: Search + Filter tabs */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative" style={{ flex: "0 0 42%" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="submissions-search-input pl-12 w-full"
            placeholder="Search Students"
            style={{ borderRadius: "100px", padding: "10px 16px 10px 44px" }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "Submitted", "Graded", "Not Submitted"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={cn("submissions-filter-btn", filterTab === tab && "active")}
              style={{ borderRadius: "100px" }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <DataTable columns={columns} data={filteredSubmissions} />
      </div>
    </Modal>
  );
};
