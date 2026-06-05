"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody } from "@/components/ui";
import { 
    Filter, 
    ChevronDown, 
    Edit3,
    Loader2
} from "lucide-react";
import { EditTimetableModal } from "@/components/ui/EditTimetableModal";
import { timetableApi, TimetableSlot } from "@/lib/api/timetable";
import { classesApi } from "@/lib/api/classes";
import { academicTermsApi } from "@/lib/api/academic-terms";

// Timetable data structure
interface TimeSlot {
  time: string;
  subject?: string;
  teacher?: string;
  slotId?: string;
  subjectId?: string;
  teacherId?: string;
}

interface DaySchedule {
  day: string;
  dayOfWeek: number;
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

const dayNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function AdminTimetablesPage() {
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    
    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<any>(null);

    // Fetch classes
    const { data: classes, isLoading: loadingClasses } = useQuery({
        queryKey: ["classes"],
        queryFn: classesApi.getClasses,
    });

    // Fetch academic terms
    const { data: terms, isLoading: loadingTerms } = useQuery({
        queryKey: ["academic-terms"],
        queryFn: academicTermsApi.getTerms,
    });

    // Fetch timetable data
    const { data: timetableSlots, isLoading: loadingTimetable, refetch: refetchTimetable } = useQuery({
        queryKey: ["timetable", selectedClass],
        queryFn: () => timetableApi.getByClass(selectedClass),
        enabled: !!selectedClass,
    });

    // Set first class as default when classes load
    React.useEffect(() => {
        if (classes && classes.length > 0 && !selectedClass) {
            setSelectedClass(classes[0].id);
        }
    }, [classes, selectedClass]);

    // Extract unique years from terms (from term names like "Term 1 - 2024")
    const years = useMemo(() => {
        if (!terms) return [];
        const uniqueYears = Array.from(new Set(
            terms.map(t => {
                const match = t.name.match(/\d{4}/);
                return match ? parseInt(match[0]) : null;
            }).filter((year): year is number => year !== null)
        ));
        return uniqueYears.sort((a, b) => b - a);
    }, [terms]);

    // Transform backend data to UI structure
    const timetableData = useMemo(() => {
        if (!timetableSlots) {
            // Return empty schedule
            return dayNames.map((day, index) => ({
                day,
                dayOfWeek: index,
                slots: timeSlots.map(time => ({ time }))
            }));
        }

        return dayNames.map((day, dayIndex) => {
            const daySlots = timetableSlots.filter(slot => slot.dayOfWeek === dayIndex);
            
            return {
                day,
                dayOfWeek: dayIndex,
                slots: timeSlots.map(timeSlot => {
                    const startTime = timeSlot.split(" - ")[0];
                    const matchingSlot = daySlots.find(s => s.startTime === startTime);
                    
                    if (matchingSlot) {
                        return {
                            time: timeSlot,
                            subject: matchingSlot.subject.name,
                            teacher: `${matchingSlot.teacher.user.firstName} ${matchingSlot.teacher.user.lastName}`,
                            slotId: matchingSlot.id,
                            subjectId: matchingSlot.subjectId,
                            teacherId: matchingSlot.teacherId,
                        };
                    }
                    
                    return { time: timeSlot };
                })
            };
        });
    }, [timetableSlots]);

    const handleEditSlot = (dayOfWeek: number, slot: TimeSlot) => {
        setActiveSlot({
            dayOfWeek,
            day: dayNames[dayOfWeek],
            time: slot.time,
            startTime: slot.time.split(" - ")[0],
            subject: slot.subject || "",
            teacher: slot.teacher || "",
            slotId: slot.slotId,
            subjectId: slot.subjectId,
            teacherId: slot.teacherId,
            classId: selectedClass,
        });
        setIsEditModalOpen(true);
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setActiveSlot(null);
        refetchTimetable();
    };

    if (loadingClasses || loadingTerms) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

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
                                <option value="" className="text-black">Select class</option>
                                {classes?.map((cls) => (
                                    <option key={cls.id} value={cls.id} className="text-black">
                                        {cls.name} {cls.stream ? `- ${cls.stream}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <ChevronDown size={14} className="opacity-70" />
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 h-11 min-w-[140px]">
                        <Filter size={16} className="text-gray-400 mr-2" />
                        <select 
                            className="bg-transparent border-none outline-none text-xs font-medium text-gray-600 w-full appearance-none cursor-pointer"
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                        >
                            <option value="">Select term</option>
                            {terms?.map((term) => (
                                <option key={term.id} value={term.id}>
                                    {term.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 h-11 min-w-[140px]">
                        <Filter size={16} className="text-gray-400 mr-2" />
                        <select 
                            className="bg-transparent border-none outline-none text-xs font-medium text-gray-600 w-full appearance-none cursor-pointer"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">Select year</option>
                            {years.map((year) => (
                                <option key={`year-${year}`} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => {
                            setActiveSlot({
                                classId: selectedClass,
                                dayOfWeek: 0,
                                day: "MONDAY",
                                time: "08:00 - 09:00",
                                startTime: "08:00",
                            });
                            setIsEditModalOpen(true);
                        }}
                        disabled={!selectedClass}
                        className="flex items-center justify-center gap-2 bg-black text-white px-5 h-11 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ADD SLOT
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-black text-white px-5 h-11 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all w-full md:w-auto text-nowrap">
                        EXPORT
                    </button>
                </div>
            </div>

            {/* Timetable Grid - Fitted to viewport */}
            {loadingTimetable ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
            ) : !selectedClass ? (
                <div className="text-center py-20 text-gray-500">
                    Please select a class to view timetable
                </div>
            ) : (
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
                                                        onClick={() => handleEditSlot(dayData.dayOfWeek, slot)}
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
            )}

            {/* Modals */}
            <EditTimetableModal 
                isOpen={isEditModalOpen}
                onClose={handleModalClose}
                initialData={activeSlot}
            />
        </div>
    );
}
