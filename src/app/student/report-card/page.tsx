"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Select } from "@/components/ui/FormElements";
import { Download } from "lucide-react";

// Course data interface
interface Course {
  name: string;
  firstTerm: {
    cat: number;
    exam: number;
    total: number;
  };
  secondTerm?: {
    cat?: number;
    exam?: number;
    total?: number;
  };
  thirdTerm?: {
    cat?: number;
    exam?: number;
    total?: number;
  };
  yearTotal?: number;
  grade?: string;
}

// Sample course data
const coursesData: Course[] = [
  {
    name: "Advanced Calculus",
    firstTerm: { cat: 38.5, exam: 42, total: 80.5 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Physics II",
    firstTerm: { cat: 42, exam: 45, total: 87 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Chemistry Fundamentals",
    firstTerm: { cat: 40.5, exam: 43, total: 83.5 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "English Literature",
    firstTerm: { cat: 44, exam: 46, total: 90 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "World History",
    firstTerm: { cat: 39, exam: 41, total: 80 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Computer Programming",
    firstTerm: { cat: 28.5, exam: 27, total: 55.5 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Data Structures",
    firstTerm: { cat: 25, exam: 26, total: 51 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Web Development",
    firstTerm: { cat: 22, exam: 24, total: 46 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Database Systems",
    firstTerm: { cat: 16.5, exam: 15, total: 31.5 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Software Engineering",
    firstTerm: { cat: 17, exam: 16, total: 33 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Mobile Development",
    firstTerm: { cat: 18, exam: 17, total: 35 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Network Security",
    firstTerm: { cat: 14, exam: 13, total: 27 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Leadership Skills",
    firstTerm: { cat: 11, exam: 9, total: 20 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Communication Skills",
    firstTerm: { cat: 10.5, exam: 9.5, total: 20 },
    secondTerm: {},
    thirdTerm: {},
  },
  {
    name: "Critical Thinking",
    firstTerm: { cat: 10, exam: 9, total: 19 },
    secondTerm: {},
    thirdTerm: {},
  }
];

export default function ReportCardPage() {
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [module, setModule] = useState("Midterm");

  // Calculate totals
  const totalFirstTerm = coursesData.reduce((sum, course) => sum + course.firstTerm.total, 0);
  const totalSecondTerm = coursesData.reduce((sum, course) => sum + (course.secondTerm?.total || 0), 0);
  const totalThirdTerm = coursesData.reduce((sum, course) => sum + (course.thirdTerm?.total || 0), 0);
  const grandTotal = 900; // As shown in the design
  const percentage = ((totalFirstTerm + totalSecondTerm + totalThirdTerm) / grandTotal * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Academic Transcript</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Academic Year</span>
            <Select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              options={[
                { value: "2024-2025", label: "2024-2025" },
                { value: "2023-2024", label: "2023-2024" },
                { value: "2022-2023", label: "2022-2023" }
              ]}
              className="w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Module</span>
            <Select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              options={[
                { value: "Midterm", label: "Midterm" },
                { value: "Final", label: "Final" },
                { value: "Annual", label: "Annual" }
              ]}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Transcript Card */}
      <Card>
        <CardBody className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transcript - {academicYear}</h2>
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Download size={16} />
              Download Transcript
            </button>
          </div>

          {/* School Info and Student Photo */}
          <div className="border-2 border-black p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">BC</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">BLINK CAMPUS</h3>
                  <p className="text-sm text-gray-600">Telephone: +1(234)567-8900</p>
                  <p className="text-sm text-gray-600">Email: info@blinkcampus.edu</p>
                </div>
              </div>
              <div className="w-24 h-32 border-2 border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-xs text-center">Student Photo</span>
              </div>
            </div>

            <hr className="border-black mb-6" />

            {/* Transcript Title */}
            <div className="text-center mb-6">
              <h4 className="text-lg font-bold text-gray-900 underline">TRANSCRIPT</h4>
            </div>

            {/* Transcript Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-black">
                {/* Header */}
                <thead>
                  <tr>
                    <th rowSpan={3} className="border border-black p-2 bg-gray-100 text-sm font-bold">COURSES</th>
                    <th colSpan={3} className="border border-black p-2 bg-gray-100 text-sm font-bold">FIRST TERM</th>
                    <th colSpan={3} className="border border-black p-2 bg-gray-100 text-sm font-bold">SECOND TERM</th>
                    <th colSpan={3} className="border border-black p-2 bg-gray-100 text-sm font-bold">THIRD TERM</th>
                    <th rowSpan={3} className="border border-black p-2 bg-gray-100 text-sm font-bold">YEAR</th>
                    <th rowSpan={3} className="border border-black p-2 bg-gray-100 text-sm font-bold">GRADE</th>
                  </tr>
                  <tr>
                    <th className="border border-black p-1 bg-gray-100 text-xs">CAT</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">EXAM</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">TOT</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">CAT</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">EXAM</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">TOT</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">CAT</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">EXAM</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">TOT</th>
                  </tr>
                  <tr>
                    <th className="border border-black p-1 bg-gray-100 text-xs">TOT</th>
                    <th className="border border-black p-1 bg-gray-100 text-xs">%</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Discipline Row */}
                  <tr>
                    <td className="border border-black p-2 bg-gray-200 font-bold text-sm">DISCIPLINE</td>
                    <td className="border border-black p-1 text-center text-sm">40</td>
                    <td className="border border-black p-1 text-center text-sm">50</td>
                    <td className="border border-black p-1 text-center text-sm">100</td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm">140</td>
                    <td className="border border-black p-1 text-center text-sm">1200</td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                  </tr>

                  {/* Marks Header */}
                  <tr>
                    <td colSpan={12} className="border border-black p-2 bg-gray-200 font-bold text-center text-sm">MARKS</td>
                  </tr>

                  {/* Course Rows */}
                  {coursesData.map((course, index) => (
                    <tr key={index}>
                      <td className="border border-black p-2 text-sm">{course.name}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.firstTerm.cat}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.firstTerm.exam}</td>
                      <td className="border border-black p-1 text-center text-sm font-bold">{course.firstTerm.total}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.secondTerm?.cat || ''}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.secondTerm?.exam || ''}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.secondTerm?.total || ''}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.thirdTerm?.cat || ''}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.thirdTerm?.exam || ''}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.thirdTerm?.total || ''}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.yearTotal || ''}</td>
                      <td className="border border-black p-1 text-center text-sm">{course.grade || ''}</td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr>
                    <td className="border border-black p-2 bg-gray-200 font-bold text-sm">Total</td>
                    <td className="border border-black p-1 text-center text-sm font-bold">376.5</td>
                    <td className="border border-black p-1 text-center text-sm font-bold">382.5</td>
                    <td className="border border-black p-1 text-center text-sm font-bold">759.0</td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                    <td className="border border-black p-1 text-center text-sm font-bold">900</td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                  </tr>

                  {/* Percentage Row */}
                  <tr>
                    <td className="border border-black p-2 bg-gray-200 font-bold text-sm">Percentage</td>
                    <td colSpan={10} className="border border-black p-2 text-center text-sm font-bold">84.33%</td>
                    <td className="border border-black p-1 text-center text-sm"></td>
                  </tr>

                  {/* Signature Row */}
                  <tr>
                    <td className="border border-black p-2 bg-gray-200 font-bold text-sm">Signature of Class Advisor</td>
                    <td colSpan={11} className="border border-black p-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
