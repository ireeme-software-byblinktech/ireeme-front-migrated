"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { disciplineApi, DisciplineCase } from "@/lib/api/discipline";

interface StudentWithCases {
  studentId: string;
  studentName: string;
  studentNumber: string;
  totalCases: number;
  openCases: number;
  totalPointsDeducted: number;
  lastIncidentDate: string | null;
  riskLevel: "High" | "Medium" | "Low";
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithCases[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("");

  useEffect(() => {
    fetchStudentsWithCases();
  }, []);

  const fetchStudentsWithCases = async () => {
    try {
      setLoading(true);
      // Fetch all cases with proper limit
      const response = await disciplineApi.getCases({ limit: 50 });
      
      // Group by student
      const studentMap = new Map<string, StudentWithCases>();
      
      response.data.forEach((caseItem) => {
        const studentId = caseItem.studentId;
        const existing = studentMap.get(studentId);
        
        if (existing) {
          existing.totalCases++;
          if (caseItem.status === "OPEN") existing.openCases++;
          existing.totalPointsDeducted += caseItem.pointsDeduct;
          
          // Update last incident date
          const caseDate = new Date(caseItem.createdAt);
          const lastDate = existing.lastIncidentDate ? new Date(existing.lastIncidentDate) : null;
          if (!lastDate || caseDate > lastDate) {
            existing.lastIncidentDate = caseItem.createdAt;
          }
        } else {
          studentMap.set(studentId, {
            studentId,
            studentName: `${caseItem.student?.user.firstName} ${caseItem.student?.user.lastName}`,
            studentNumber: caseItem.student?.studentNumber || "N/A",
            totalCases: 1,
            openCases: caseItem.status === "OPEN" ? 1 : 0,
            totalPointsDeducted: caseItem.pointsDeduct,
            lastIncidentDate: caseItem.createdAt,
            riskLevel: "Low",
          });
        }
      });
      
      // Calculate risk levels
      const studentsArray = Array.from(studentMap.values()).map((student) => {
        if (student.totalPointsDeducted >= 50 || student.openCases >= 3) {
          student.riskLevel = "High";
        } else if (student.totalPointsDeducted >= 20 || student.openCases >= 2) {
          student.riskLevel = "Medium";
        } else {
          student.riskLevel = "Low";
        }
        return student;
      });
      
      // Sort by total points (highest first)
      studentsArray.sort((a, b) => b.totalPointsDeducted - a.totalPointsDeducted);
      
      setStudents(studentsArray);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = !riskFilter || student.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1"
    >
      <PageHeader
        title="Monitored Students"
        subtitle="Track and monitor students with disciplinary history"
      />

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="py-3 px-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchQuery || riskFilter ? "No students match your filters" : "No students with discipline cases found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, i) => (
            <motion.div
              key={student.studentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
                <CardBody className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{student.studentName}</h3>
                      <p className="text-[11px] text-gray-600 mt-1">{student.studentNumber}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold",
                      student.riskLevel === "High" ? "bg-red-50 text-red-500" :
                        student.riskLevel === "Medium" ? "bg-amber-50 text-amber-500" :
                          "bg-emerald-50 text-emerald-500"
                    )}>
                      {student.riskLevel} Risk
                    </span>
                  </div>

                  <div className="space-y-2 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 text-[12px]">Total Cases:</span>
                      <span className="font-bold text-gray-900">{student.totalCases}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 text-[12px]">Open Cases:</span>
                      <span className="font-bold text-red-600">{student.openCases}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 text-[12px]">Points Deducted:</span>
                      <span className="font-bold text-red-600">-{student.totalPointsDeducted}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 text-[12px]">Last Incident:</span>
                      <span className="font-bold text-gray-900">
                        {student.lastIncidentDate ? new Date(student.lastIncidentDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-900 rounded-xl py-6 h-auto font-bold flex gap-2 items-center justify-center transition-transform hover:scale-[1.02]"
                    onClick={() => window.location.href = `/discipline/students/${student.studentId}`}
                  >
                    <Eye size={18} /> View Details
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

