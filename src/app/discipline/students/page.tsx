"use client";

import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  TrendingDown,
  TrendingUp,
  Minus
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const monitoredStudents = [
  {
    id: "STU2024001",
    name: "John Smith",
    grade: "Grade 10-A",
    risk: "Medium",
    totalIncidents: 5,
    recentIncidents: 2,
    lastIncident: "15/03/2024",
    trend: "down",
    trendLabel: "Declining"
  },
  {
    id: "STU2024003",
    name: "Michael Brown",
    grade: "Grade 11-A",
    risk: "High",
    totalIncidents: 8,
    recentIncidents: 3,
    lastIncident: "14/03/2024",
    trend: "down",
    trendLabel: "Declining"
  },
  {
    id: "STU2024005",
    name: "David Lee",
    grade: "Grade 12-B",
    risk: "Medium",
    totalIncidents: 6,
    recentIncidents: 1,
    lastIncident: "12/03/2024",
    trend: "up",
    trendLabel: "Improving"
  },
  {
    id: "STU2024002",
    name: "Emily Davis",
    grade: "Grade 9-B",
    risk: "Low",
    totalIncidents: 3,
    recentIncidents: 1,
    lastIncident: "14/03/2024",
    trend: "stable",
    trendLabel: "Stable"
  },
  {
    id: "STU2024006",
    name: "Sarah Johnson",
    grade: "Grade 10-C",
    risk: "Low",
    totalIncidents: 4,
    recentIncidents: 2,
    lastIncident: "13/03/2024",
    trend: "stable",
    trendLabel: "Stable"
  },
  {
    id: "STU2024007",
    name: "Alex Rodriguez",
    grade: "Grade 11-B",
    risk: "High",
    totalIncidents: 7,
    recentIncidents: 3,
    lastIncident: "16/03/2024",
    trend: "down",
    trendLabel: "Declining"
  },
  {
    id: "STU2024008",
    name: "Jessica Chen",
    grade: "Grade 9-A",
    risk: "Low",
    totalIncidents: 2,
    recentIncidents: 1,
    lastIncident: "10/03/2024",
    trend: "up",
    trendLabel: "Improving"
  },
  {
    id: "STU2024012",
    name: "Sophia Taylor",
    grade: "Grade 9-C",
    risk: "Low",
    totalIncidents: 1,
    recentIncidents: 1,
    lastIncident: "08/03/2024",
    trend: "stable",
    trendLabel: "Stable"
  },
  {
    id: "STU2024010",
    name: "Olivia Martinez",
    grade: "Grade 10-B",
    risk: "Low",
    totalIncidents: 3,
    recentIncidents: 1,
    lastIncident: "09/03/2024",
    trend: "stable",
    trendLabel: "Stable"
  },
];

export default function StudentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1"
    >
      <PageHeader
        title="Monitered students"
        subtitle="Track and monitor students with significant disciplinary history"
      />

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className="bg-white shadow-sm p-2 rounded-md text-black px-4 flex gap-2 items-center font-bold text-sm">
              <Grid size={16} /> Grid
            </button>
            <button className="p-2 px-4 text-gray-400 flex gap-2 items-center font-bold text-sm hover:text-gray-600 transition-colors">
              <List size={16} /> Table
            </button>
          </div>
          <Button variant="outline" className="flex gap-2 items-center font-medium border-gray-200 text-gray-600">
            <Filter size={16} /> All Risk levels
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitoredStudents.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-none shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{student.name}</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{student.id}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{student.grade}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold",
                    student.risk === "High" ? "bg-red-50 text-red-500" :
                      student.risk === "Medium" ? "bg-amber-50 text-amber-500" :
                        "bg-emerald-50 text-emerald-500"
                  )}>
                    {student.risk} Risk
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-bold uppercase tracking-tight text-[12px]">Total Incidents:</span>
                    <span className="font-black text-gray-900">{student.totalIncidents}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-bold uppercase tracking-tight text-[12px]">Recent (30 days):</span>
                    <span className="font-black text-gray-900">{student.recentIncidents}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-bold uppercase tracking-tight text-[12px]">Last Incident:</span>
                    <span className="font-black text-gray-900">{student.lastIncident}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-bold uppercase tracking-tight text-[12px]">Behavior Trend:</span>
                    <span className={cn(
                      "flex items-center gap-1 font-black",
                      student.trend === "up" ? "text-emerald-500" :
                        student.trend === "down" ? "text-red-500" :
                          "text-gray-400"
                    )}>
                      {student.trend === "up" && <TrendingUp size={14} />}
                      {student.trend === "down" && <TrendingDown size={14} />}
                      {student.trend === "stable" && <Minus size={14} />}
                      {student.trendLabel}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-900 rounded-xl py-6 h-auto font-bold flex gap-2 items-center justify-center transition-transform hover:scale-[1.02]">
                  <Eye size={18} /> View Details
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
