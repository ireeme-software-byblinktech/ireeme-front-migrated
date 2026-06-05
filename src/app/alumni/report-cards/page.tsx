"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download, ChevronDown, FileText, Printer, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const YEARS = ["Class of 2015", "Class of 2014", "Class of 2013"];

const SUBJECTS = [
  { name: "Advanced Calculus", cat: 38.5, exam: 42, tot: 80.5, grade: "A+" },
  { name: "Physics II", cat: 42, exam: 45, tot: 87, grade: "A+" },
  { name: "Chemistry Fundamentals", cat: 40.5, exam: 43, tot: 83.5, grade: "A" },
  { name: "English Literature", cat: 44, exam: 46, tot: 90, grade: "A+" },
  { name: "World History", cat: 39, exam: 41, tot: 80, grade: "A" },
  { name: "Computer Programming", cat: 28.5, exam: 27, tot: 55.5, grade: "C" },
  { name: "Data Structures", cat: 25, exam: 26, tot: 51, grade: "C" },
  { name: "Web Development", cat: 22, exam: 24, tot: 46, grade: "D" },
];

export default function AlumniReportCardPage() {
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">Academic Transcripts</h2>
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
              <h3 className="text-lg font-black text-black uppercase">Official Transcript</h3>
              <p className="text-xs font-bold text-gray-400 italic">Historical Record: {selectedYear}</p>
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
             <Button className="bg-black text-white hover:bg-emerald-600 rounded-xl px-6 h-10 font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-black/20 transition-colors">
                <Download size={16} />
                Export PDF
              </Button>
          </div>
        </div>

        <div className="border-[4px] border-black p-12 relative overflow-x-auto bg-white rounded-xl">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none transform -translate-y-1/2 translate-x-1/2">
             <img src="/icons/logo.png" alt="" className="w-full h-full grayscale" />
          </div>

          <div className="flex justify-between items-start mb-12 border-b-[4px] border-black pb-10">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 bg-black rounded-3xl flex items-center justify-center shadow-xl">
                <img src="/icons/logo.png" alt="Logo" className="w-16 h-16 invert" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-black mb-1 italic tracking-tighter">IREME SCHOOLS</h1>
                <p className="text-sm font-black text-gray-800 uppercase tracking-widest opacity-60">Verified Alumni Achievement Record</p>
                <div className="mt-4 space-y-1">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      Issue Date: July 20, 2015
                   </p>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      Verification ID: BC-AL-99421
                   </p>
                </div>
              </div>
            </div>
            <div className="w-32 h-40 border-[3px] border-black rounded-2xl flex flex-col items-center justify-center p-3 text-center bg-gray-50 relative overflow-hidden group">
               <div className="absolute inset-0 border-2 border-dashed border-gray-200 m-1 rounded-xl group-hover:border-black/10 transition-all" />
               <span className="text-[10px] text-gray-400 font-black uppercase leading-tight z-10 italic">Official Institutional Seal</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black underline underline-offset-8 decoration-[5px] tracking-[0.2em] italic uppercase">TRANSCRIPT OF RESULTS</h2>
            <div className="mt-4 text-xs font-black text-gray-500 uppercase tracking-widest italic">{selectedYear} / Year 3 Final Assessment</div>
          </div>

          <div className="relative">
             <div className="absolute -left-4 -top-4 w-8 h-8 border-l-4 border-t-4 border-black" />
             <div className="absolute -right-4 -bottom-4 w-8 h-8 border-r-4 border-b-4 border-black" />
             
             <table className="w-full border-collapse border-[4px] border-black text-xs font-black">
              <thead>
                <tr className="bg-black text-white">
                  <th className="border-[4px] border-black p-4 text-left w-1/4 uppercase italic tracking-widest">COURSES</th>
                  <th className="border-[4px] border-black p-2 uppercase text-center bg-gray-900 border-white/10 italic">CAT (50%)</th>
                  <th className="border-[4px] border-black p-2 uppercase text-center bg-gray-800 border-white/10 italic">EXAM (50%)</th>
                  <th className="border-[4px] border-black p-2 uppercase text-center bg-gray-700 border-white/10 italic">TOTAL (100)</th>
                  <th className="border-[4px] border-black p-4 text-center uppercase italic">GRADE</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECTS.map((course, idx) => (
                  <tr key={idx} className={cn(idx % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                    <td className="border-[3px] border-black p-4 text-left font-black uppercase text-[10px] tracking-tighter">{course.name}</td>
                    <td className="border-[3px] border-black p-2 text-center">{course.cat}</td>
                    <td className="border-[3px] border-black p-2 text-center">{course.exam}</td>
                    <td className="border-[3px] border-black p-2 text-center font-bold bg-gray-100/50">{course.tot}</td>
                    <td className={cn(
                      "border-[3px] border-black p-2 text-center font-black",
                      course.grade.includes('A') ? "bg-black text-white" : "bg-gray-100 text-black"
                    )}>{course.grade}</td>
                  </tr>
                ))}
                <tr className="bg-black text-white">
                  <td className="border-[4px] border-black p-4 text-left font-black uppercase italic tracking-widest">Aggregate Cumulative</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">279.5</td>
                  <td className="border-[4px] border-black p-2 text-center font-black">294.0</td>
                  <td colSpan={2} className="border-[4px] border-black p-6 text-center font-black text-2xl italic tracking-widest bg-white text-black">
                    84.33%
                  </td>
                </tr>
                <tr>
                  <td className="border-[4px] border-black p-6 text-left font-black uppercase h-32 align-top italic tracking-tighter opacity-70">Signature of Registrar</td>
                  <td colSpan={4} className="border-[4px] border-black p-3 relative bg-gray-50/30">
                     <div className="absolute bottom-6 right-10 flex flex-col items-center">
                        <div className="w-48 border-b-2 border-black border-dashed mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Verified Alumni Signature</span>
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

