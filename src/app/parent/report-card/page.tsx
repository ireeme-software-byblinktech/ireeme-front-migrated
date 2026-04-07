"use client";

import { useState } from "react";
import { ChildTabs } from "@/components/parent/ChildTabs";
import { Button } from "@/components/ui/Button";
import { Download, ChevronDown, FileText, Printer, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CHILDREN = ["Emma Thompson", "Oliver Smith", "Sophia Johnson"];
const YEARS = ["2024-2025", "2023-2024", "2022-2023"];

export default function ReportCardPage() {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);

  return (
    <div className="pb-10">
      <ChildTabs 
        children={CHILDREN} 
        selectedChild={selectedChild} 
        onChildChange={setSelectedChild} 
        label="Children:"
      />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">Academic Transcript</h2>
        <div className="flex items-center gap-4 bg-white px-4 py-2 border border-gray-100 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Year</span>
          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 pr-10 text-sm font-black text-gray-900 outline-none focus:ring-2 focus:ring-black cursor-pointer transition-all"
            >
              {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white border-[3px] border-black rounded-[40px] p-8 shadow-xl shadow-black/5">
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-dashed border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-black uppercase">{selectedChild}'s Transcript</h3>
              <p className="text-xs font-bold text-gray-400 italic">Academic Session: {selectedYear}</p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-xl border-gray-200 h-10 px-4 hover:bg-gray-50 transition-all font-bold text-xs uppercase flex items-center gap-2">
                <Printer size={16} />
                Print
             </Button>
             <Button variant="outline" className="rounded-xl border-gray-200 h-10 px-4 hover:bg-gray-50 transition-all font-bold text-xs uppercase flex items-center gap-2">
                <Share2 size={16} />
                Share
             </Button>
             <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 h-10 font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-black/20">
                <Download size={16} />
                Export PDF
              </Button>
          </div>
        </div>

        <div className="border-[4px] border-black p-12 relative overflow-x-auto bg-white rounded-xl">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none transform -translate-y-1/2 translate-x-1/2">
             <img src="/icons/logo.png" alt="" className="w-full h-full grayscale" />
          </div>

          {/* Transcript Header section */}
          <div className="flex justify-between items-start mb-12 border-b-[4px] border-black pb-10">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 bg-black rounded-3xl flex items-center justify-center shadow-xl">
                <img src="/icons/logo.png" alt="Logo" className="w-16 h-16 invert" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-black mb-1 italic tracking-tighter">IREME PAY</h1>
                <p className="text-sm font-black text-gray-800 uppercase tracking-widest opacity-60">National Examination Board School</p>
                <div className="mt-4 space-y-1">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      Telephone: +1(234)567-8900
                   </p>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      Email: info@blinkcampus.edu
                   </p>
                </div>
              </div>
            </div>
            <div className="w-32 h-40 border-[3px] border-black rounded-2xl flex flex-col items-center justify-center p-3 text-center bg-gray-50 relative overflow-hidden group">
               <div className="absolute inset-0 border-2 border-dashed border-gray-200 m-1 rounded-xl group-hover:border-black/10 transition-all" />
               <span className="text-[10px] text-gray-400 font-black uppercase leading-tight z-10">Paste Student Photo Here</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black underline underline-offset-8 decoration-[5px] tracking-[0.2em] italic uppercase">OFFICIAL TRANSCRIPT</h2>
          </div>

          {/* Transcript Table */}
          <div className="relative">
             <div className="absolute -left-4 -top-4 w-8 h-8 border-l-4 border-t-4 border-black" />
             <div className="absolute -right-4 -bottom-4 w-8 h-8 border-r-4 border-b-4 border-black" />
             
             <table className="w-full border-collapse border-[4px] border-black text-xs font-black">
              <thead>
                <tr className="bg-black text-white">
                  <th rowSpan={2} className="border-[4px] border-black p-4 text-left w-1/4 uppercase italic tracking-widest">COURSES</th>
                  <th colSpan={3} className="border-[4px] border-black p-2 uppercase text-center bg-gray-900 border-white/10 italic">TERM I</th>
                  <th colSpan={3} className="border-[4px] border-black p-2 uppercase text-center bg-gray-800 border-white/10 italic">TERM II</th>
                  <th colSpan={3} className="border-[4px] border-black p-2 uppercase text-center bg-gray-700 border-white/10 italic">TERM III</th>
                  <th colSpan={2} className="border-[4px] border-black p-2 uppercase text-center bg-black border-white/10 italic">YEAR</th>
                  <th rowSpan={2} className="border-[4px] border-black p-4 text-center uppercase italic">GRADE</th>
                </tr>
                <tr className="bg-gray-100 text-black border-b-[4px] border-black">
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">CAT</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">EXAM</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter font-bold">TOT</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">CAT</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">EXAM</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter font-bold">TOT</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">CAT</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">EXAM</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter font-bold">TOT</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">TOT</th>
                  <th className="border-[3px] border-black p-2 text-center uppercase tracking-tighter">%</th>
                </tr>
              </thead>
              <tbody>
                {/* Discipline Row */}
                <tr className="bg-gray-50 border-b-[4px] border-black">
                  <td className="border-[3px] border-black p-4 text-left uppercase font-black italic tracking-wider">DISCIPLINE</td>
                  <td className="border-[3px] border-black p-2 text-center">40</td>
                  <td className="border-[3px] border-black p-2 text-center">50</td>
                  <td className="border-[3px] border-black p-2 text-center font-bold">100</td>
                  <td className="border-[3px] border-black p-2 text-center">--</td>
                  <td className="border-[3px] border-black p-2 text-center">--</td>
                  <td className="border-[3px] border-black p-2 text-center">--</td>
                  <td className="border-[3px] border-black p-2 text-center">--</td>
                  <td className="border-[3px] border-black p-2 text-center">--</td>
                  <td className="border-[3px] border-black p-2 text-center">--</td>
                  <td className="border-[3px] border-black p-2 text-center">140</td>
                  <td className="border-[3px] border-black p-2 text-center font-bold">1200</td>
                  <td className="border-[3px] border-black p-2 text-center font-black text-xs">--</td>
                </tr>
                {/* Marks Header */}
                <tr>
                  <td colSpan={13} className="border-[4px] border-black p-2 text-center font-black bg-black text-white uppercase text-[11px] tracking-[0.5em] italic">MARKS OBTAINED</td>
                </tr>
                {/* Course Rows */}
                {[
                  { name: "Advanced Calculus", cat: 38.5, exam: 42, tot: 80.5, grade: "A+" },
                  { name: "Physics II", cat: 42, exam: 45, tot: 87, grade: "A+" },
                  { name: "Chemistry Fundamentals", cat: 40.5, exam: 43, tot: 83.5, grade: "A" },
                  { name: "English Literature", cat: 44, exam: 46, tot: 90, grade: "A+" },
                  { name: "World History", cat: 39, exam: 41, tot: 80, grade: "A" },
                  { name: "Computer Programming", cat: 28.5, exam: 27, tot: 55.5, grade: "C" },
                  { name: "Data Structures", cat: 25, exam: 26, tot: 51, grade: "C" },
                  { name: "Web Development", cat: 22, exam: 24, tot: 46, grade: "D" },
                ].map((course, idx) => (
                  <tr key={idx} className={cn(idx % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                    <td className="border-[3px] border-black p-4 text-left font-black uppercase text-[10px] tracking-tighter">{course.name}</td>
                    <td className="border-[3px] border-black p-2 text-center">{course.cat}</td>
                    <td className="border-[3px] border-black p-2 text-center">{course.exam}</td>
                    <td className="border-[3px] border-black p-2 text-center font-bold bg-gray-100/50">{course.tot}</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center">--</td>
                    <td className="border-[3px] border-black p-2 text-center font-black bg-gray-900 text-white">{course.grade}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-black text-white">
                  <td className="border-[4px] border-black p-4 text-left font-black uppercase italic tracking-widest">Aggregate Total</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">279.5</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">294.0</td>
                  <td className="border-[4px] border-black p-2 text-center font-black bg-white text-black">573.5</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">--</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">--</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">--</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">--</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">--</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">--</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">900</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">--</td>
                  <td className="border-[4px] border-black p-2 text-center font-black italic">--</td>
                </tr>
                {/* Percentage Row */}
                <tr className="border-[4px] border-black">
                  <td className="border-[4px] border-black p-4 text-left font-black uppercase italic tracking-widest bg-gray-100">Cumulative Percentage</td>
                  <td colSpan={12} className="border-[4px] border-black p-6 text-center font-black text-2xl italic tracking-widest">
                    {selectedYear === "2024-2025" ? "84.33%" : selectedYear === "2023-2024" ? "88.15%" : "82.40%"}
                  </td>
                </tr>
                {/* Signature Row */}
                <tr>
                  <td className="border-[4px] border-black p-6 text-left font-black uppercase h-32 align-top italic tracking-tighter opacity-70">Signature of Principal / Class Advisor</td>
                  <td colSpan={12} className="border-[4px] border-black p-3 relative bg-gray-50/30">
                     <div className="absolute bottom-6 right-10 flex flex-col items-center">
                        <div className="w-48 border-b-2 border-black border-dashed mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Official Stamp</span>
                     </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}