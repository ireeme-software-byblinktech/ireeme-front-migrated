"use client";

import { Download, ChevronLeft } from "lucide-react";
import Link from "next/link";

const GradePill = ({ val }: { val: number | string | null }) => {
  if (val === null || val === "--") {
    return (
      <div className="w-[80px] h-[42px] rounded-[10px] bg-[#CBD5E1] text-white font-bold flex items-center justify-center mx-auto text-[15px]">
        --
      </div>
    );
  }
  return (
    <div className="w-[80px] h-[42px] rounded-[10px] bg-black text-white font-bold flex items-center justify-center mx-auto text-[15px]">
      {val}
    </div>
  );
};

export default function GradeDetailPage({ params }: { params: { id: string } }) {
  // Generate 12 identical rows based on the mockup image 
  const MOCK_DATA = Array(12).fill({
    name: "Emily Davis",
    id: "202120010101",
    assign: 15,
    quiz: 20,
    cat: 47.3, // Third row has midterm=null. Let's make it dynamic below
    midterm: 88.5,
    final: 88.5,
  }).map((row, idx) => ({
    ...row,
    rowId: idx,
    // Emulating the screenshot where some rows have nulls
    cat: idx >= 2 ? null : 47.3,
    midterm: idx < 2 ? null : 47.3,
  }));

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/teacher/grades" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-3" style={{ textDecoration: 'none' }}>
            <ChevronLeft size={16} /> Back to All Grades
          </Link>
          <h1 className="text-[28px] font-bold mb-2">Gradebook:Mathematics - Year 2A</h1>
          <p className="text-gray-500 font-medium text-[15px]">Manage and track student grades across all classes</p>
        </div>
        <button className="bg-black text-white px-8 py-3 rounded-md font-semibold text-[14px]">
          Export All Grades
        </button>
      </div>

      {/* Floating Stats */}
      <div className="flex justify-center gap-8 mb-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#374151]">class Average:</span>
          <span className="bg-black text-white px-5 py-2 rounded-full font-bold text-sm">82.23%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#374151]">At-Risk Students</span>
          <span className="bg-black text-white px-5 py-2 rounded-full font-bold text-sm">10</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#374151]">Pending Grades</span>
          <span className="bg-black text-white px-5 py-2 rounded-full font-bold text-sm">4</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl overflow-hidden border-[1.5px] border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap border-b-[1.5px] border-gray-200">
                STUDENT
              </th>
              <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap border-b-[1.5px] border-gray-200">
                STUDENT ID
              </th>
              <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-center border-b-[1.5px] border-gray-200">
                ASSIGNMENT#1(20PTS)
              </th>
              <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-center border-b-[1.5px] border-gray-200">
                QUIZ #1(20 PTS)
              </th>
              <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-center border-b-[1.5px] border-gray-200">
                CAT #1(50PTS)
              </th>
              <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-center border-b-[1.5px] border-gray-200">
                MIDETERM(100PTS)
              </th>
              <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-center border-b-[1.5px] border-gray-200">
                FINAL GRADE(%)
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((row) => (
              <tr key={row.rowId} className="border-b-[1px] border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[15px] whitespace-nowrap text-[#374151]">
                  {row.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-[#F1F5F9] text-gray-500 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase whitespace-nowrap">
                    {row.id}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <GradePill val={row.assign} />
                </td>
                <td className="px-6 py-4">
                  <GradePill val={row.quiz} />
                </td>
                <td className="px-6 py-4">
                  <GradePill val={row.cat} />
                </td>
                <td className="px-6 py-4">
                  <GradePill val={row.midterm} />
                </td>
                <td className="px-6 py-4">
                  <GradePill val={row.final} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Basic Pagination mimicking the screenshot */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button className="w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm text-gray-400 hover:bg-gray-100 transition-colors">
          {"<"}
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-[8px] font-bold text-sm bg-black text-white">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-[8px] font-bold text-sm text-gray-500 border border-gray-300 hover:bg-gray-100 transition-colors bg-white">
          2
        </button>
        <span className="w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm text-gray-400">
          ...
        </span>
        <button className="w-8 h-8 flex items-center justify-center rounded-[8px] font-bold text-sm text-gray-500 border border-gray-300 hover:bg-gray-100 transition-colors bg-white">
          5
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm text-gray-400 hover:bg-gray-100 transition-colors">
          {">"}
        </button>
      </div>

    </div>
  );
}
