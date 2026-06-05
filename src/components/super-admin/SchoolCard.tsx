"use client";

import { Card } from "@/components/ui/Card";
import { Edit, ToggleRight, ToggleLeft, Users, GraduationCap, School as SchoolIcon, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface SchoolCardProps {
  school: {
    id: string;
    name: string;
    code: string;
    dateJoined: string;
    totalStudents: number;
    totalStaff: number;
    status: "Active" | "Inactive";
  };
  onEdit: (school: any) => void;
  onToggle: (id: string) => void;
}

export function SchoolCard({ school, onEdit, onToggle }: SchoolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="p-8 rounded-[32px] border border-gray-100 flex flex-col h-full shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="text-gray-300 hover:text-black transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            {/* 3D Icon Container */}
            <div className="absolute inset-0 rounded-[24px] bg-black shadow-lg shadow-black/20 transform rotate-6 group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute inset-0 rounded-[24px] bg-black flex items-center justify-center text-white z-10 
              shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_0_10px_20px_rgba(0,0,0,0.1)]
              after:content-[''] after:absolute after:inset-0 after:rounded-[24px] after:shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]">
              <SchoolIcon size={34} strokeWidth={2.5} />
            </div>
          </div>
          
          <h3 className="font-black text-[22px] text-gray-950 leading-tight mb-2 tracking-tight line-clamp-1">{school.name}</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{school.code}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50/50 rounded-2xl p-5 flex flex-col gap-2 border border-transparent hover:border-gray-200 transition-all group/stat">
            <div className="flex items-center gap-2 text-gray-400 group-hover/stat:text-black transition-colors">
              <GraduationCap size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Students</span>
            </div>
            <span className="text-[20px] font-black text-gray-950 tracking-tighter">{school.totalStudents.toLocaleString()}</span>
          </div>
          <div className="bg-gray-50/50 rounded-2xl p-5 flex flex-col gap-2 border border-transparent hover:border-gray-200 transition-all group/stat">
            <div className="flex items-center gap-2 text-gray-400 group-hover/stat:text-black transition-colors">
              <Users size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Staff</span>
            </div>
            <span className="text-[20px] font-black text-gray-950 tracking-tighter">{school.totalStaff.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
          <div className="flex items-center gap-2">
             <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Joined {school.dateJoined.split('-')[2]}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onEdit(school)}
              className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all shadow-sm border border-gray-100"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onToggle(school.id)}
              className="transition-all"
            >
              {school.status === "Active" ? (
                <div className="w-14 h-7 bg-black rounded-full relative p-1.5 transition-all shadow-lg shadow-black/10">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1.5 shadow-sm"></div>
                </div>
              ) : (
                <div className="w-14 h-7 bg-gray-200 rounded-full relative p-1.5 transition-all">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1.5 shadow-sm"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

