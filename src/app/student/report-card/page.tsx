"use client";

import { useState } from "react";
import { Button, Select } from "@/components/ui";
import { Download, Printer, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const YEARS = ["2024-2025", "2023-2024", "2022-2023"];
const MODULES = ["Midterm", "End of Term", "Annual"];

const TRANSCRIPT_DATA = [
  { name: "Advanced Calculus", first: { cat: 38.5, exam: 42, tot: 80.5 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Physics II", first: { cat: 42, exam: 45, tot: 87 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Chemistry Fundamentals", first: { cat: 40.5, exam: 43, tot: 83.5 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "English Literature", first: { cat: 44, exam: 46, tot: 90 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "World History", first: { cat: 39, exam: 41, tot: 80 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Computer Programming", first: { cat: 28.5, exam: 27, tot: 55.5 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Data Structures", first: { cat: 25, exam: 26, tot: 51 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Web Development", first: { cat: 22, exam: 24, tot: 46 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Database Systems", first: { cat: 16.5, exam: 15, tot: 31.5 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Software Engineering", first: { cat: 17, exam: 16, tot: 33 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Mobile Development", first: { cat: 18, exam: 17, tot: 35 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Network Security", first: { cat: 14, exam: 13, tot: 27 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Leadership Skills", first: { cat: 11, exam: 9, tot: 20 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Communication Skills", first: { cat: 10.5, exam: 9.5, tot: 20 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
  { name: "Critical Thinking", first: { cat: 10, exam: 9, tot: 19 }, second: { cat: null, exam: null, tot: null }, third: { cat: null, exam: null, tot: null }, year: { tot: null, perc: null }, grade: "" },
];

export default function StudentReportCardPage() {
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [selectedModule, setSelectedModule] = useState(MODULES[0]);

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Academic Transcript</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Academic Year</span>
             <Select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                options={YEARS.map(y => ({ value: y, label: y }))}
                className="w-32 h-10"
             />
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Module</span>
             <Select 
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                options={MODULES.map(m => ({ value: m, label: m }))}
                className="w-40 h-10"
             />
          </div>
        </div>
      </div>

      {/* Main Transcript Card */}
      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Transcript - {selectedYear}</h2>
          <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 px-6 h-11 rounded-xl">
            <Download size={18} />
            Download Transcript
          </Button>
        </div>

        {/* The Document View */}
        <div className="border-[2px] border-black p-10 max-w-5xl mx-auto bg-white overflow-x-auto">
          {/* Document Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-[#1e293b] rounded-xl flex items-center justify-center">
                 <img src="/icons/logo.png" alt="Logo" className="w-12 h-12 invert" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-black leading-tight tracking-tight">BLINK CAMPUS</h3>
                <div className="text-sm text-gray-600 space-y-0.5">
                   <p>Telephone: +1(234)567-8900</p>
                   <p>Email: info@blinkcampus.edu</p>
                </div>
              </div>
            </div>
            <div className="w-24 h-32 border border-gray-300 bg-gray-50 flex items-center justify-center p-2 text-center">
               <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Student Photo</span>
            </div>
          </div>

          <div className="h-[2px] bg-black w-full mb-8" />

          <div className="text-center mb-8">
             <h4 className="text-2xl font-black text-black tracking-[0.1em] uppercase underline underline-offset-8 decoration-[3px]">TRANSCRIPT</h4>
          </div>

          {/* Transcript Table */}
          <table className="w-full border-collapse border-2 border-black text-[11px] font-bold">
            <thead>
              <tr>
                <th rowSpan={2} className="border-2 border-black p-3 text-left w-[25%] uppercase">COURSES</th>
                <th colSpan={3} className="border-2 border-black p-2 text-center uppercase bg-gray-50">FIRST TERM</th>
                <th colSpan={3} className="border-2 border-black p-2 text-center uppercase bg-gray-50">SECOND TERM</th>
                <th colSpan={3} className="border-2 border-black p-2 text-center uppercase bg-gray-50">THIRD TERM</th>
                <th colSpan={2} className="border-2 border-black p-2 text-center uppercase bg-gray-50">YEAR</th>
                <th rowSpan={2} className="border-2 border-black p-3 text-center uppercase w-[10%]">GRADE</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border-2 border-black p-1.5 text-center text-[9px]">CAT</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">EXAM</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">TOT</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">CAT</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">EXAM</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">TOT</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">CAT</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">EXAM</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">TOT</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">TOT</th>
                <th className="border-2 border-black p-1.5 text-center text-[9px]">%</th>
              </tr>
            </thead>
            <tbody>
              {/* Discipline Row */}
              <tr>
                <td className="border-2 border-black p-3 text-left uppercase">DISCIPLINE</td>
                <td className="border-2 border-black p-2 text-center">40</td>
                <td className="border-2 border-black p-2 text-center">50</td>
                <td className="border-2 border-black p-2 text-center">100</td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center">140</td>
                <td className="border-2 border-black p-2 text-center">1200</td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
              </tr>
              
              {/* Marks Section Header */}
              <tr className="bg-gray-100">
                 <td colSpan={13} className="border-2 border-black p-2 text-center font-black tracking-widest uppercase">MARKS</td>
              </tr>

              {/* Courses Rows */}
              {TRANSCRIPT_DATA.map((course, idx) => (
                <tr key={idx}>
                  <td className="border-2 border-black p-3 text-left uppercase">{course.name}</td>
                  <td className="border-2 border-black p-2 text-center">{course.first.cat ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.first.exam ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center bg-gray-50/50">{course.first.tot ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.second.cat ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.second.exam ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.second.tot ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.third.cat ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.third.exam ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.third.tot ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center font-bold">{course.year.tot ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.year.perc ?? ""}</td>
                  <td className="border-2 border-black p-2 text-center">{course.grade ?? ""}</td>
                </tr>
              ))}

              {/* Totals Row */}
              <tr className="bg-gray-50">
                <td className="border-2 border-black p-3 text-left uppercase font-black">Total</td>
                <td className="border-2 border-black p-2 text-center font-black">376.5</td>
                <td className="border-2 border-black p-2 text-center font-black">382.5</td>
                <td className="border-2 border-black p-2 text-center font-black">759.0</td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center"></td>
                <td className="border-2 border-black p-2 text-center font-black"></td>
                <td className="border-2 border-black p-2 text-center font-black">900</td>
                <td className="border-2 border-black p-2 text-center"></td>
              </tr>

              {/* Percentage Row */}
              <tr>
                <td className="border-2 border-black p-3 text-left uppercase font-black">Percentage</td>
                <td colSpan={3} className="border-2 border-black p-3 text-center font-black text-lg italic tracking-widest underline decoration-2 underline-offset-4">
                  84.33%
                </td>
                <td colSpan={9} className="border-2 border-black bg-gray-50/20"></td>
              </tr>

              {/* Advisor Row */}
              <tr>
                <td className="border-2 border-black p-3 text-left uppercase font-black h-24 align-top">Signature of Class Advisor</td>
                <td colSpan={12} className="border-2 border-black p-3"></td>
              </tr>
            </tbody>
          </table>

          {/* Page Footer Info */}
          <div className="mt-6 flex justify-between items-end">
            <div className="text-[10px] text-gray-400 font-medium italic">
               This is an electronically generated transcript. No signature is required.
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="w-32 h-0.5 bg-black/10" />
               <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Official Portal Record</span>
            </div>
          </div>
        </div>

        {/* Extra Action Buttons (Optional but helpful) */}
        <div className="mt-8 flex justify-center gap-4">
           <button className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-bold uppercase tracking-widest">
              <Printer size={16} />
              Print Version
           </button>
           <div className="w-px h-4 bg-gray-200" />
           <button className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-bold uppercase tracking-widest">
              <Share2 size={16} />
              Share Securely
           </button>
        </div>
      </div>
    </div>
  );
}
