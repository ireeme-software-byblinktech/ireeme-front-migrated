"use client";

import { useState } from "react";
import { ChildTabs } from "@/components/parent/ChildTabs";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Filter, ChevronDown, Search, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface GradeRecord {
  id: string;
  subject: string;
  title: string;
  term: string;
  grade: string;
}

const GRADES_DATA: Record<string, GradeRecord[]> = {
  "Joel Queen": [
    { id: "1", subject: "Mathematics", title: "CAT", term: "Term 1", grade: "80%" },
    { id: "2", subject: "Physics", title: "CAT", term: "Term 1", grade: "80%" },
    { id: "3", subject: "Mathematics", title: "QUIZ 1", term: "Term 1", grade: "90%" },
    { id: "4", subject: "English", title: "CAT", term: "Term 1", grade: "70%" },
    { id: "5", subject: "Chemistry", title: "CAT", term: "Term 1", grade: "80%" },
    { id: "6", subject: "Biology", title: "CAT", term: "Term 1", grade: "85%" },
    { id: "7", subject: "History", title: "QUIZ 1", term: "Term 1", grade: "75%" },
    { id: "8", subject: "Geography", title: "CAT", term: "Term 2", grade: "80%" },
  ],
  "Jane Doe": [
    { id: "1", subject: "Mathematics", title: "EXAM", term: "Term 1", grade: "95%" },
    { id: "2", subject: "Art", title: "PROJECT", term: "Term 1", grade: "100%" },
  ],
  "Jack Peele": [
    { id: "1", subject: "Science", title: "CAT", term: "Term 1", grade: "88%" },
  ]
};

const CHILDREN = ["Joel Queen", "Jane Doe", "Jack Peele"];

export default function GradesPage() {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [titleFilter, setTitleFilter] = useState("All");
  const [termFilter, setTermFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState<GradeRecord | null>(null);

  const columns: Column<GradeRecord>[] = [
    { key: "subject", header: "Subject", width: "25%" },
    { key: "title", header: "Title", width: "20%" },
    { key: "term", header: "Term", width: "20%" },
    { key: "grade", header: "Grade", width: "20%" },
    { 
      key: "action", 
      header: "Action", 
      width: "15%",
      align: "center",
      render: (value, record) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black text-white hover:bg-gray-800 h-8 px-4 text-xs font-semibold rounded-lg"
          onClick={() => setSelectedRecord(record)}
        >
          view
        </Button>
      )
    },
  ];

  const currentData = GRADES_DATA[selectedChild] || [];
  
  const uniqueTitles = ["All", ...Array.from(new Set(currentData.map(d => d.title)))];
  const uniqueTerms = ["All", ...Array.from(new Set(currentData.map(d => d.term)))];
  const uniqueGrades = ["All", ...Array.from(new Set(currentData.map(d => d.grade)))];

  const filteredData = currentData.filter(record => {
    return (titleFilter === "All" || record.title === titleFilter) &&
           (termFilter === "All" || record.term === termFilter) &&
           (gradeFilter === "All" || record.grade === gradeFilter);
  });

  return (
    <div className="pb-10">
      <ChildTabs 
        children={CHILDREN} 
        selectedChild={selectedChild} 
        onChildChange={(child) => {
          setSelectedChild(child);
          setTitleFilter("All");
          setTermFilter("All");
          setGradeFilter("All");
        }} 
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black uppercase tracking-tight">Grades overview</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 px-4 py-2 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter By</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Title</span>
              <select 
                value={titleFilter} 
                onChange={e => setTitleFilter(e.target.value)}
                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 outline-none focus:border-black cursor-pointer"
              >
                {uniqueTitles.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Term</span>
              <select 
                value={termFilter} 
                onChange={e => setTermFilter(e.target.value)}
                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 outline-none focus:border-black cursor-pointer"
              >
                {uniqueTerms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Grade</span>
              <select 
                value={gradeFilter} 
                onChange={e => setGradeFilter(e.target.value)}
                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 outline-none focus:border-black cursor-pointer"
              >
                {uniqueGrades.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable 
          columns={columns as any} 
          data={filteredData as any} 
          className="parent-portal-table"
        />
      </div>

      {/* Grade Details Modal */}
      <Modal
        open={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Grade Performance Details"
        size="md"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedRecord.subject}</h4>
                <p className="text-sm font-medium text-gray-500">{selectedRecord.title} • {selectedRecord.term}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-2xl font-black text-black">{selectedRecord.grade}</span>
                <p className="text-[10px] font-bold text-green-500">EXCELLENT</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Class Average</p>
                <p className="text-lg font-bold text-gray-900">72%</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Highest Grade</p>
                <p className="text-lg font-bold text-gray-900">98%</p>
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3">
              <Info size={18} className="text-blue-500 shrink-0" />
              <p className="text-xs leading-relaxed text-blue-900 font-medium">
                Your child is performing 18% above the class average. Keep up the good work!
              </p>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
              <Button className="bg-black text-white">Full Report Card</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
