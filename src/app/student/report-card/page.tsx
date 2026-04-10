"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

const YEARS = ["2024-2025", "2023-2024", "2022-2023"];
const MODULES = ["Midterm", "End of term"];

const SUBJECTS = [
  { name: "Advanced Calculus", first: { cat: 38.5, exam: 42, tot: 80.5 } },
  { name: "Physics II", first: { cat: 42, exam: 45, tot: 87 } },
  { name: "Chemistry Fundamentals", first: { cat: 40.5, exam: 43, tot: 83.5 } },
  { name: "English Literature", first: { cat: 44, exam: 46, tot: 90 } },
  { name: "World History", first: { cat: 39, exam: 41, tot: 80 } },
  { name: "Computer Programming", first: { cat: 28.5, exam: 27, tot: 55.5 } },
  { name: "Data Structures", first: { cat: 25, exam: 26, tot: 51 } },
  { name: "Web Development", first: { cat: 22, exam: 24, tot: 46 } },
  { name: "Database Systems", first: { cat: 16.5, exam: 15, tot: 31.5 } },
  { name: "Software Engineering", first: { cat: 17, exam: 16, tot: 33 } },
  { name: "Mobile Development", first: { cat: 18, exam: 17, tot: 35 } },
  { name: "Network Security", first: { cat: 14, exam: 13, tot: 27 } },
  { name: "Leadership Skills", first: { cat: 11, exam: 9, tot: 20 } },
  { name: "Communication Skills", first: { cat: 10.5, exam: 9.5, tot: 20 } },
  { name: "Critical Thinking", first: { cat: 10, exam: 9, tot: 19 } },
];

export default function StudentReportCardPage() {
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [selectedModule, setSelectedModule] = useState(MODULES[0]);

  return (
    <div className="pb-10 bg-white min-h-screen text-black">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <h2 className="text-3xl font-black text-black">Academic Transcript</h2>
        
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Academic Year</label>
            <div className="relative border border-gray-200 rounded-xl">
               <select 
                 value={selectedYear}
                 onChange={(e) => setSelectedYear(e.target.value)}
                 className="appearance-none bg-transparent px-4 py-3 pr-10 text-sm font-medium outline-none cursor-pointer w-48 text-gray-700"
               >
                 {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
               </select>
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Module</label>
            <div className="relative border border-gray-200 rounded-xl">
               <select 
                 value={selectedModule}
                 onChange={(e) => setSelectedModule(e.target.value)}
                 className="appearance-none bg-transparent px-4 py-3 pr-10 text-sm font-medium outline-none cursor-pointer w-48 text-gray-700"
               >
                 {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
               </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="border border-gray-100 bg-white rounded-[24px] p-6 shadow-sm mx-4">
        
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-bold">Transcript - {selectedYear}</h3>
           <button className="bg-black text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
              <Download size={16} />
              Download Transcript
           </button>
        </div>

        {/* Paper Container */}
        <div className="border-[3px] border-black p-8 relative mx-auto bg-white" style={{ maxWidth: '1000px' }}>
             
           {/* School Header */}
           <div className="flex justify-between items-start mb-6 border-b-2 border-black pb-6">
              <div className="flex gap-6 items-center">
                 <div className="w-24 h-24 bg-[#1a2332] rounded-2xl flex items-center justify-center">
                    <img src="/icons/logo.png" alt="Logo" className="w-16 h-16 object-contain filter invert opacity-80" />
                 </div>
                 <div className="space-y-1">
                    <h1 className="text-3xl font-black mb-1 text-black">BLINK CAMPUS</h1>
                    <p className="text-sm font-medium text-gray-500">Telephone: +1(234)567-8900</p>
                    <p className="text-sm font-medium text-gray-500">Email: info@blinkcampus.edu</p>
                 </div>
              </div>
              <div className="w-24 h-32 border-2 border-gray-300 flex items-center justify-center p-2">
                 <span className="text-[10px] text-gray-400 text-center uppercase tracking-wider">Student Photo</span>
              </div>
           </div>

           <div className="text-center mb-6 mt-4">
              <h2 className="text-lg font-black underline underline-offset-4 uppercase tracking-[0.1em] text-black">TRANSCRIPT</h2>
           </div>

           {/* Table */}
           <div className="overflow-x-auto text-black">
              <table className="w-full border-collapse border-2 border-black text-sm">
                 <thead>
                    <tr>
                       <th rowSpan={2} className="border-[2px] border-black p-3 text-left w-[240px] uppercase font-bold text-xs bg-gray-50">COURSES</th>
                       <th colSpan={3} className="border-[2px] border-black p-3 text-center uppercase font-bold text-xs bg-white">FIRST TERM</th>
                       <th colSpan={3} className="border-[2px] border-black p-3 text-center uppercase font-bold text-xs bg-white">SECOND TERM</th>
                       <th colSpan={3} className="border-[2px] border-black p-3 text-center uppercase font-bold text-xs bg-white">THIRD TERM</th>
                       <th colSpan={2} className="border-[2px] border-black p-3 text-center uppercase font-bold text-xs bg-white">YEAR</th>
                       <th rowSpan={2} className="border-[2px] border-black p-3 text-center uppercase font-bold text-xs bg-gray-50 w-20">GRADE</th>
                    </tr>
                    <tr className="bg-gray-50 text-[10px] font-bold text-center uppercase">
                       <td className="border-[2px] border-black py-1 px-2 w-[48px]">CAT</td>
                       <td className="border-[2px] border-black py-1 px-2 w-[48px]">EXAM</td>
                       <td className="border-[2px] border-black py-1 px-2 w-[52px]">TOT</td>
                       
                       <td className="border-[2px] border-black py-1 px-2 w-[48px]">CAT</td>
                       <td className="border-[2px] border-black py-1 px-2 w-[48px]">EXAM</td>
                       <td className="border-[2px] border-black py-1 px-2 w-[52px]">TOT</td>
                       
                       <td className="border-[2px] border-black py-1 px-2 w-[48px]">CAT</td>
                       <td className="border-[2px] border-black py-1 px-2 w-[48px]">EXAM</td>
                       <td className="border-[2px] border-black py-1 px-2 w-[52px]">TOT</td>
                       
                       <td className="border-[2px] border-black py-1 px-2 w-[52px]">TOT</td>
                       <td className="border-[2px] border-black py-1 px-2 w-[30px]">%</td>
                    </tr>
                 </thead>
                 <tbody className="text-xs font-semibold text-center text-black">
                    <tr className="bg-gray-200/50">
                       <td className="border-[2px] border-black p-2.5 text-left font-black uppercase text-[11px] tracking-widest text-black">DISCIPLINE</td>
                       <td className="border-[2px] border-black p-2.5 font-bold">40</td>
                       <td className="border-[2px] border-black p-2.5 font-bold">50</td>
                       <td className="border-[2px] border-black p-2.5 font-bold">100</td>
                       <td className="border-[2px] border-black p-2.5"></td>
                       <td className="border-[2px] border-black p-2.5"></td>
                       <td className="border-[2px] border-black p-2.5"></td>
                       <td className="border-[2px] border-black p-2.5"></td>
                       <td className="border-[2px] border-black p-2.5"></td>
                       <td className="border-[2px] border-black p-2.5"></td>
                       <td className="border-[2px] border-black p-2.5 font-bold">140</td>
                       <td className="border-[2px] border-black p-2.5 font-bold">1200</td>
                       <td className="border-[2px] border-black p-2.5"></td>
                    </tr>
                    <tr>
                       <td colSpan={13} className="border-[2px] border-black py-2 font-black text-black uppercase text-center text-[11px] tracking-widest bg-gray-50/50">MARKS</td>
                    </tr>
                    
                    {SUBJECTS.map((sub, idx) => (
                       <tr key={idx}>
                         <td className="border-[2px] border-black p-2.5 text-left font-medium text-[13px]">{sub.name}</td>
                         <td className="border-[2px] border-black p-2.5">{sub.first.cat}</td>
                         <td className="border-[2px] border-black p-2.5">{sub.first.exam}</td>
                         <td className="border-[2px] border-black p-2.5 font-bold">{sub.first.tot}</td>
                         
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                         <td className="border-[2px] border-black p-2.5 bg-gray-100/50"></td>
                       </tr>
                    ))}
                    
                    {/* Footer Totals */}
                    <tr className="bg-gray-100/80">
                       <td className="border-[2px] border-black p-3 text-left font-black text-[13px] text-black">Total</td>
                       <td className="border-[2px] border-black p-3 font-bold">376.5</td>
                       <td className="border-[2px] border-black p-3 font-bold">382.5</td>
                       <td className="border-[2px] border-black p-3 font-bold text-[13px] text-black">759.0</td>
                       <td className="border-[2px] border-black p-3"></td>
                       <td className="border-[2px] border-black p-3"></td>
                       <td className="border-[2px] border-black p-3"></td>
                       <td className="border-[2px] border-black p-3"></td>
                       <td className="border-[2px] border-black p-3"></td>
                       <td className="border-[2px] border-black p-3"></td>
                       <td className="border-[2px] border-black p-3 font-bold text-black">900</td>
                       <td className="border-[2px] border-black p-3"></td>
                       <td className="border-[2px] border-black p-3"></td>
                    </tr>
                    <tr>
                       <td className="border-[2px] border-black p-3 text-left font-black text-[13px] text-black bg-white">Percentage</td>
                       <td colSpan={3} className="border-[2px] border-black p-3 font-black text-[13px] text-center bg-white text-black">84.33%</td>
                       <td colSpan={9} className="border-[2px] border-black p-3 bg-gray-50/50"></td>
                    </tr>
                    <tr>
                       <td className="border-[2px] border-black p-3 text-left font-bold text-sm align-top bg-white">Signature of Class Advisor</td>
                       <td colSpan={12} className="border-[2px] border-black p-3 bg-white h-[4.5rem]"></td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
