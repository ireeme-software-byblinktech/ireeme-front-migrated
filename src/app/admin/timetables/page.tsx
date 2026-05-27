"use client";

import React, { useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { 
    Filter, 
    ChevronDown, 
    Edit3
} from "lucide-react";
import { EditTimetableModal } from "@/components/ui/EditTimetableModal";

// Timetable data structure
interface TimeSlot {
  time: string;
  subject?: string;
  teacher?: string;
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00", 
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00"
];

const timetableData: DaySchedule[] = [
  {
    day: "MONDAY",
    slots: [
      { time: "08:00 - 09:00", subject: "Mathematics", teacher: "Prof. Johnson" },
      { time: "09:00 - 10:00", subject: "Mathematics", teacher: "Prof. Johnson" },
      { time: "10:00 - 11:00", subject: "Physics", teacher: "Dr. Smith" },
      { time: "11:00 - 12:00" },
      { time: "12:00 - 13:00" }, 
      { time: "13:00 - 14:00", subject: "English", teacher: "Ms. Brown" },
      { time: "14:00 - 15:00" },
      { time: "15:00 - 16:00" }
    ]
  },
  {
    day: "TUESDAY", 
    slots: [
      { time: "08:00 - 09:00" },
      { time: "09:00 - 10:00", subject: "Chemistry", teacher: "Prof. Williams" },
      { time: "10:00 - 11:00" },
      { time: "11:00 - 12:00", subject: "History", teacher: "Mr. Davis" },
      { time: "12:00 - 13:00" }, 
      { time: "13:00 - 14:00" },
      { time: "14:00 - 15:00", subject: "Computer Science", teacher: "Dr. Anderson" },
      { time: "15:00 - 16:00" }
    ]
  },
  {
    day: "WEDNESDAY",
    slots: [
      { time: "08:00 - 09:00", subject: "Mathematics", teacher: "Prof. Johnson" },
      { time: "09:00 - 10:00" },
      { time: "10:00 - 11:00", subject: "Biology", teacher: "Dr. Martinez" },
      { time: "11:00 - 12:00", subject: "Biology", teacher: "Dr. Martinez" },
      { time: "12:00 - 13:00" }, 
      { time: "13:00 - 14:00" },
      { time: "14:00 - 15:00" },
      { time: "15:00 - 16:00", subject: "PE", teacher: "Coach Wilson" }
    ]
  },
  {
    day: "THURSDAY",
    slots: [
      { time: "08:00 - 09:00" },
      { time: "09:00 - 10:00", subject: "Physics", teacher: "Dr. Smith" },
      { time: "10:00 - 11:00" },
      { time: "11:00 - 12:00", subject: "English", teacher: "Ms. Brown" },
      { time: "12:00 - 13:00" }, 
      { time: "13:00 - 14:00" },
      { time: "14:00 - 15:00", subject: "Art", teacher: "Ms. Taylor" },
      { time: "15:00 - 16:00", subject: "Art", teacher: "Ms. Taylor" }
    ]
  },
  {
    day: "FRIDAY",
    slots: [
      { time: "08:00 - 09:00", subject: "Chemistry", teacher: "Prof. Williams" },
      { time: "09:00 - 10:00" },
      { time: "10:00 - 11:00", subject: "Computer Science", teacher: "Dr. Anderson" },
      { time: "11:00 - 12:00", subject: "Computer Science", teacher: "Dr. Anderson" },
      { time: "12:00 - 13:00" }, 
      { time: "13:00 - 14:00", subject: "History", teacher: "Mr. Davis" },
      { time: "14:00 - 15:00" },
      { time: "15:00 - 16:00" }
    ]
  }
];

export default function AdminTimetablesPage() {
    const [selectedClass, setSelectedClass] = useState("s5");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    
    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<any>(null);

    const handleEditSlot = (day: string, slot: TimeSlot) => {
        setActiveSlot({
            day,
            time: slot.time,
            subject: slot.subject || "",
            teacher: slot.teacher || ""
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Timetables</h1>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    <div className="flex items-center bg-black text-white rounded-lg px-3 h-11 transition-all min-w-[150px]">
                        <Filter size={16} className="mr-2 opacity-70" />
                        <div className="flex flex-col flex-1">
                            <span className="text-[9px] opacity-60 font-bold uppercase tracking-wider">Class</span>
                            <select 
                                className="bg-transparent border-none outline-none text-xs font-medium w-full appearance-none cursor-pointer"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="s5" className="text-black">S5 MPC</option>
                                <option value="s6" className="text-black">S6 MPC</option>
                            </select>
                        </div>
                        <ChevronDown size={14} className="opacity-70" />
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 h-11 min-w-[140px]">
                        <Filter size={16} className="text-gray-400 mr-2" />
                        <select className="bg-transparent border-none outline-none text-xs font-medium text-gray-600 w-full appearance-none cursor-pointer">
                            <option value="">Select term</option>
                        </select>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 h-11 min-w-[140px]">
                        <Filter size={16} className="text-gray-400 mr-2" />
                        <select className="bg-transparent border-none outline-none text-xs font-medium text-gray-600 w-full appearance-none cursor-pointer">
                            <option value="">Select year</option>
                        </select>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-black text-white px-5 h-11 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all w-full md:w-auto"
                    >
                        EDIT TIMETABLE
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-black text-white px-5 h-11 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all w-full md:w-auto text-nowrap">
                        EXPORT
                    </button>
                </div>
            </div>

            {/* Timetable Grid - Fitted to viewport */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <div className="w-full">
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr>
                                    <th className="bg-black text-white p-5 text-center font-bold border border-gray-800 w-[80px] text-[12px] uppercase tracking-wider">
                                        DAY / HR
                                    </th>
                                    {timeSlots.map((time, index) => (
                                        <th key={index} className="bg-black text-white p-5 text-center font-bold border border-gray-800 text-[11px] uppercase tracking-tight">
                                            {time}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            
                            <tbody>
                                {timetableData.map((dayData, dayIndex) => (
                                    <tr key={dayIndex}>
                                        <td className="bg-gray-50 p-2 font-bold text-gray-900 border border-gray-200 text-center text-[10px] uppercase tracking-wider">
                                            {dayData.day.slice(0, 3)}
                                        </td>
                                        
                                        {dayData.slots.map((slot, slotIndex) => {
                                            if (slotIndex === 4) {
                                                if (dayIndex === 0) {
                                                    return (
                                                        <td key={slotIndex} className="border border-gray-200 bg-gray-50/50 p-1 align-middle text-center" rowSpan={5}>
                                                            <div className="flex flex-col items-center justify-center h-full space-y-0.5">
                                                                <div className="text-sm font-black text-gray-300 leading-none">L</div>
                                                                <div className="text-sm font-black text-gray-300 leading-none">U</div>
                                                                <div className="text-sm font-black text-gray-300 leading-none">N</div>
                                                                <div className="text-sm font-black text-gray-300 leading-none">C</div>
                                                                <div className="text-sm font-black text-gray-300 leading-none">H</div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return null;
                                            }
                                            
                                            return (
                                                <td 
                                                    key={slotIndex} 
                                                    onClick={() => handleEditSlot(dayData.day, slot)}
                                                    className="border border-gray-200 p-2 h-20 align-top hover:bg-gray-50 transition-colors group cursor-pointer relative"
                                                >
                                                    {slot.subject ? (
                                                        <div className="flex flex-col h-full overflow-hidden">
                                                            <div className="font-bold text-gray-900 mb-0.5 leading-tight text-[10px] uppercase truncate">{slot.subject}</div>
                                                            <div className="text-[9px] text-gray-500 font-medium truncate">{slot.teacher}</div>
                                                            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                                <Edit3 size={10} className="text-gray-400" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full border border-dashed border-gray-100 rounded"></div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Modals */}
            <EditTimetableModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={activeSlot}
            />
        </div>
    );
}