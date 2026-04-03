"use client";

import Link from "next/link";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GraduationCap, BookOpen, FileText, BarChart2 } from "lucide-react";
import { useState } from "react";

// Stats data array
const statsData = [
  {
    label: "Total Subjects",
    value: 15,
    icon: <GraduationCap size={18} />,
    progress: 75,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Assignments", 
    value: 30,
    icon: <BookOpen size={18} />,
    progress: 80,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Notes",
    value: 30, 
    icon: <FileText size={18} />,
    progress: 65,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Reports",
    value: 30,
    icon: <BarChart2 size={18} />,
    progress: 90,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

// Assignment data
interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  progress: number;
  status: "Submitted" | "Late" | "Pending" | "To do" | "Done";
  dueDate: string;
  category: "Pending" | "To do" | "Done";
}

const assignmentsData: Assignment[] = [
  {
    id: "1",
    title: "Lab Report: Kinematics",
    subject: "Physics",
    teacher: "Dr. Anais Kamal",
    progress: 100,
    status: "Submitted",
    dueDate: "2024-03-15",
    category: "Done"
  },
  {
    id: "2", 
    title: "Quiz: World Religions",
    subject: "Social Studies",
    teacher: "Mr. Mujesha Jean",
    progress: 67,
    status: "Late",
    dueDate: "2024-03-12",
    category: "Pending"
  },
  {
    id: "3",
    title: "Essay: Climate Change Impact", 
    subject: "Environmental Science",
    teacher: "Dr. Sarah Wilson",
    progress: 45,
    status: "Pending",
    dueDate: "2024-03-20",
    category: "Pending"
  },
  {
    id: "4",
    title: "Math Problem Set 5",
    subject: "Mathematics", 
    teacher: "Prof. Michael Brown",
    progress: 0,
    status: "To do",
    dueDate: "2024-03-25",
    category: "To do"
  },
  {
    id: "5",
    title: "History Research Paper",
    subject: "History",
    teacher: "Ms. Jennifer Davis", 
    progress: 85,
    status: "Pending",
    dueDate: "2024-03-18",
    category: "Pending"
  },
  {
    id: "6",
    title: "Chemistry Lab Report",
    subject: "Chemistry",
    teacher: "Dr. Robert Johnson",
    progress: 100,
    status: "Submitted", 
    dueDate: "2024-03-10",
    category: "Done"
  },
  {
    id: "7",
    title: "Literature Analysis",
    subject: "English",
    teacher: "Mrs. Emily Clark",
    progress: 30,
    status: "Pending",
    dueDate: "2024-03-22",
    category: "Pending"
  },
  {
    id: "8",
    title: "Biology Presentation",
    subject: "Biology",
    teacher: "Dr. Lisa Anderson",
    progress: 0,
    status: "To do",
    dueDate: "2024-03-28",
    category: "To do"
  },
  {
    id: "9",
    title: "Spanish Vocabulary Test",
    subject: "Spanish",
    teacher: "Señora Maria Rodriguez",
    progress: 100,
    status: "Submitted",
    dueDate: "2024-03-08",
    category: "Done"
  },
  {
    id: "10",
    title: "Physics Problem Set",
    subject: "Physics",
    teacher: "Dr. Anais Kamal",
    progress: 75,
    status: "Pending",
    dueDate: "2024-03-19",
    category: "Pending"
  },
  {
    id: "11",
    title: "Art Portfolio Review",
    subject: "Art",
    teacher: "Mr. David Thompson",
    progress: 0,
    status: "To do",
    dueDate: "2024-03-30",
    category: "To do"
  },
  {
    id: "12",
    title: "Computer Science Project",
    subject: "Computer Science",
    teacher: "Prof. Alex Kumar",
    progress: 100,
    status: "Submitted",
    dueDate: "2024-03-05",
    category: "Done"
  }
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"Pending" | "To do" | "Done">("Pending");

  // Filter assignments based on active tab
  const filteredAssignments = assignmentsData.filter(assignment => assignment.category === activeTab);

  const columns: Column<Assignment>[] = [
    {
      key: "title",
      header: "",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-white" />
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">{row.subject} • {row.teacher}</div>
          </div>
        </div>
      )
    },
    {
      key: "progress",
      header: "",
      align: "center",
      render: (_, row) => (
        <div className="text-sm font-medium text-gray-900">
          {row.progress}%
        </div>
      )
    },
    {
      key: "status", 
      header: "",
      align: "center",
      render: (_, row) => (
        <div className={`text-sm font-medium ${
          row.status === "Submitted" ? "text-gray-600" : 
          row.status === "Late" ? "text-red-600" : 
          row.status === "To do" ? "text-blue-600" : "text-orange-600"
        }`}>
          {row.status}
        </div>
      )
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: () => (
        <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
          View submission
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
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

      {/* Assignments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
            <Link href="/student/assignments" className="text-sm text-gray-600 hover:text-gray-900 font-medium ml-auto">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            {(["Pending", "To do", "Done"] as const).map((tab) => (
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
          
          {/* Table */}
          <div className="px-6 py-4">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={filteredAssignments as unknown as Record<string, unknown>[]}
              keyField="id"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
