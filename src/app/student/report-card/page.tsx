"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui";
import { Download, Printer, Share2 } from "lucide-react";
import { useActiveTerm } from "@/hooks/api/useAcademicTerms";
import { useStudentGrades, useStudentProfile } from "@/hooks/api/useStudentAPI";

export default function StudentReportCardPage() {
  const { data: profile } = useStudentProfile();
  const { data: activeTerm } = useActiveTerm();

  const { data: gradesResponse, isLoading: isLoadingGrades } = useStudentGrades(
    profile?.id, 
    activeTerm?.id
  );

  // Group grades by subject
  const transcriptData = useMemo(() => {
    if (!gradesResponse?.data) return [];

    const gradesBySubject: Record<string, any> = {};
    gradesResponse.data.forEach(grade => {
      const subjectName = grade.subject?.name || "Unknown Course";
      if (!gradesBySubject[subjectName]) {
        gradesBySubject[subjectName] = {
          name: subjectName,
          first: { cat: null, exam: null, tot: null },
          second: { cat: null, exam: null, tot: null },
          third: { cat: null, exam: null, tot: null },
          year: { tot: null, perc: null },
          grade: ""
        };
      }

      gradesBySubject[subjectName].first.tot = grade.score;
      gradesBySubject[subjectName].grade = grade.score >= 90 ? "A" : grade.score >= 80 ? "B" : grade.score >= 70 ? "C" : grade.score >= 60 ? "D" : "F";
    });

    return Object.values(gradesBySubject);
  }, [gradesResponse]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Academic Transcript</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Academic Term</span>
            <div className="text-sm font-bold px-4 py-2 bg-gray-100 rounded-lg min-w-[200px] text-center">
              {activeTerm?.name || "No Active Term"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Transcript</h2>
          <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 px-6 h-11 rounded-xl">
            <Download size={18} />
            Download Transcript
          </Button>
        </div>

        {isLoadingGrades ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="border-[2px] border-black p-10 max-w-5xl mx-auto bg-white overflow-x-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center">
                  <img src="/icons/logo.png" alt="Logo" className="w-20 h-20 invert" />
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
              <h4 className="text-2xl font-black text-black uppercase underline underline-offset-8 decoration-[3px]">TRANSCRIPT</h4>
            </div>

            {transcriptData.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No grades available for this term.</div>
            ) : (
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
                  <tr className="bg-gray-100">
                    <td colSpan={13} className="border-2 border-black p-2 text-center font-black tracking-widest uppercase">MARKS</td>
                  </tr>

                  {transcriptData.map((course: any, idx: number) => (
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

                  <tr className="bg-gray-50">
                    <td className="border-2 border-black p-3 text-left uppercase font-black">Total</td>
                    <td colSpan={10} className="border-2 border-black p-2 text-center"></td>
                    <td className="border-2 border-black p-2 text-center font-black">{gradesResponse?.gpa || "-"} GPA</td>
                    <td className="border-2 border-black p-2 text-center"></td>
                  </tr>

                  <tr>
                    <td className="border-2 border-black p-3 text-left uppercase font-black h-24 align-top">Signature of Class Advisor</td>
                    <td colSpan={12} className="border-2 border-black p-3"></td>
                  </tr>
                </tbody>
              </table>
            )}

            <div className="mt-6 flex justify-between items-end">
              <div className="text-[10px] text-gray-400 font-medium italic">
                This is an electronically generated transcript. No signature is required.
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="w-32 h-0.5 bg-black/10" />
                <span className="text-[10px] font-medium text-gray-300">Official Portal Record</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-semibold">
            <Printer size={16} />
            Print Version
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-semibold">
            <Share2 size={16} />
            Share Securely
          </button>
        </div>
      </div>
    </div>
  );
}

