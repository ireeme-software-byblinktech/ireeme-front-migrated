'use client';

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useMe } from "@/features/auth/queries";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_NUMBERS = [1, 2, 3, 4, 5, 6];

interface SchoolSettings {
  id: string;
  schoolId: string;
  timeSlots: string[];
  periodDuration: number;
  breakTime: string | null;
  lunchTime: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TimetableSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  className: string;
  subjectName: string;
  subjectCode: string;
  room: string | null;
  classId?: string;
}

export default function TeacherSchedulePage() {
  const { data: user } = useMe();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  // Fetch school settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["school-settings"],
    queryFn: async () => {
      try {
        const response = await apiClient<SchoolSettings>("/school-settings");
        return response;
      } catch (error) {
        console.error("Error fetching school settings:", error);
        return null;
      }
    },
  });

  // Fetch timetable slots for teacher (all classes)
  const { data: timetableData, isLoading: timetableLoading } = useQuery({
    queryKey: ["teacher-timetable-slots"],
    queryFn: async () => {
      try {
        const response = await apiClient<{ slots: TimetableSlot[] }>(
          "/teachers/timetable-slots"
        );
        return response;
      } catch (error) {
        console.error("Error fetching timetable slots:", error);
        return null;
      }
    },
    enabled: !!user,
  });

  // Get unique classes taught by the teacher (sorted by name for consistency)
  const teacherClasses = useMemo(() => {
    if (!timetableData || !timetableData.slots) return [];
    const classMap = new Map();
    
    timetableData.slots.forEach((slot) => {
      if (slot.classId && !classMap.has(slot.classId)) {
        classMap.set(slot.classId, {
          id: slot.classId,
          name: slot.className,
        });
      }
    });
    
    // Sort by name for consistent ordering
    return Array.from(classMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [timetableData]);

  // Set default selected class to first class if not already set
  useMemo(() => {
    if (teacherClasses.length > 0 && !selectedClassId) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  // Filter timetable slots by selected class
  const filteredSlots = useMemo(() => {
    if (!timetableData || !selectedClassId) return [];
    return timetableData.slots.filter((slot) => slot.classId === selectedClassId);
  }, [timetableData, selectedClassId]);

  // Get selected class name
  const selectedClassName = useMemo(() => {
    return teacherClasses.find(cls => cls.id === selectedClassId)?.name || "";
  }, [teacherClasses, selectedClassId]);

  // Build time ranges from settings
  const timeRanges = useMemo(() => {
    if (!settings) return [];
    
    // If no break/lunch times configured, generate default time slots
    const breakTime = settings.breakTime || "10:00";
    const lunchTime = settings.lunchTime || "12:00";
    const periodDuration = settings.periodDuration || 45;
    
    // Generate time slots from 8:00 AM to 4:00 PM
    const timeSlots: string[] = [];
    for (let hour = 8; hour < 16; hour++) {
      timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
      timeSlots.push(`${String(hour).padStart(2, '0')}:${periodDuration}`);
    }
    
    const ranges = [];
    for (let i = 0; i < timeSlots.length - 1; i++) {
      const startTime = timeSlots[i];
      const endTime = timeSlots[i + 1];
      ranges.push({
        startTime,
        endTime,
        label: `${startTime} - ${endTime}`,
        index: i,
      });
    }
    return ranges;
  }, [settings]);

  // Build schedule grid based on filtered slots
  const scheduleGrid = useMemo(() => {
    if (!settings || !filteredSlots) return null;

    const grid: Record<number, Record<number, any>> = {};

    // Initialize grid with break and lunch indicators first
    DAY_NUMBERS.forEach((dayNum) => {
      grid[dayNum] = {};
      timeRanges.forEach((range) => {
        // Check if this time slot is break or lunch
        if (settings.breakTime && settings.breakTime === range.startTime) {
          grid[dayNum][range.index] = {
            type: "break",
            content: null,
          };
        } else if (settings.lunchTime && settings.lunchTime === range.startTime) {
          grid[dayNum][range.index] = {
            type: "lunch",
            content: null,
          };
        } else {
          grid[dayNum][range.index] = {
            type: "empty",
            content: null,
          };
        }
      });
    });

    // Add classes to grid (overwrite empty cells only)
    filteredSlots.forEach((slot) => {
      // Find which time range this slot belongs to
      const rangeIndex = timeRanges.findIndex((r) => r.startTime === slot.startTime);
      
      if (rangeIndex !== -1 && grid[slot.dayOfWeek]) {
        // Only add class if the cell is empty (not break or lunch)
        if (grid[slot.dayOfWeek][rangeIndex].type === "empty") {
          grid[slot.dayOfWeek][rangeIndex] = {
            type: "class",
            content: slot,
          };
        }
      }
    });

    return grid;
  }, [settings, filteredSlots, timeRanges]);

  // Export to CSV
  const handleExport = () => {
    if (!scheduleGrid || !settings) return;

    setIsExporting(true);
    try {
      // Build CSV data
      let csv = `Timetable Export - ${selectedClassName}\n`;
      csv += `Exported: ${new Date().toLocaleDateString()}\n\n`;

      // Header row
      csv += "DAY/HOUR";
      timeRanges.forEach((range) => {
        csv += `,"${range.label}"`;
      });
      csv += "\n";

      // Data rows
      DAY_NUMBERS.forEach((dayNum, dayIdx) => {
        csv += DAYS[dayIdx];
        timeRanges.forEach((range) => {
          const cell = scheduleGrid[dayNum][range.index];
          if (cell.type === "class" && cell.content) {
            csv += `,"${cell.content.subjectCode} - ${cell.content.className} (R${cell.content.room})"`;
          } else if (cell.type === "break") {
            csv += `,"BREAK"`;
          } else if (cell.type === "lunch") {
            csv += `,"LUNCH"`;
          } else {
            csv += `,""`;
          }
        });
        csv += "\n";
      });

      // Create blob and download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Timetable-${selectedClassName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export timetable");
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading = settingsLoading || timetableLoading;

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-black mb-0">Timetable</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Your weekly class schedule</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting || !selectedClassName || isLoading}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap order-2 sm:order-1"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-900 transition-colors whitespace-nowrap order-1 sm:order-2">
            Reminders
          </button>
        </div>
      </div>

      {/* Class Selection */}
      {!isLoading && teacherClasses.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3">
          <label className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Select Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium bg-white hover:border-gray-400 focus:border-black focus:outline-none transition-colors flex-1 sm:flex-none"
          >
            <option value="">-- Choose a class --</option>
            {teacherClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="inline-block animate-spin">
            <CalendarIcon size={40} className="text-gray-300" />
          </div>
          <p className="text-gray-500 mt-3 text-sm font-medium">Loading your timetable...</p>
        </div>
      )}

      {/* Empty Settings State */}
      {!isLoading && !settings && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CalendarIcon size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">School Settings Not Configured</h2>
          <p className="text-sm text-gray-600">The school administrator needs to configure school settings.</p>
        </div>
      )}

      {/* Schedule Grid */}
      {!isLoading && settings && scheduleGrid && timeRanges.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* "Current Week" Label */}
          <div className="px-3 sm:px-3 py-2 border-b border-gray-200 bg-white">
            <h2 className="text-xs sm:text-sm font-semibold text-gray-900">Current Week</h2>
          </div>

          {/* Table - Responsive with horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              {/* Header Row with Time Ranges */}
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-3 py-2 text-left text-xs font-bold min-w-[95px] border-r border-gray-700">
                    DAY / HOUR
                  </th>
                  {timeRanges.map((range, idx) => (
                    <th
                      key={idx}
                      className="px-2 py-2 text-center text-xs font-bold min-w-[105px] border-r border-gray-700"
                    >
                      {range.label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body - Days */}
              <tbody>
                {DAY_NUMBERS.map((dayNum, dayIdx) => (
                  <tr key={dayNum} className="border-b border-gray-200">
                    {/* Day cell */}
                    <td className="px-3 py-2 text-left text-xs font-bold text-gray-900 bg-gray-50 border-r border-gray-200">
                      {DAYS[dayIdx]}
                    </td>

                    {/* Time slot cells */}
                    {timeRanges.map((range, rangeIdx) => {
                      const cell = scheduleGrid[dayNum][range.index];

                      if (cell.type === "class" && cell.content) {
                        return (
                          <td
                            key={`${dayNum}-${rangeIdx}`}
                            className="px-2 py-2 border-r border-gray-200 text-center min-h-[80px] bg-white hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                              <div className="text-xs font-bold text-gray-900">{cell.content.subjectCode}</div>
                              <div className="text-xs text-gray-700">{cell.content.className}</div>
                              {cell.content.room && (
                                <div className="text-xs text-gray-600">R{cell.content.room}</div>
                              )}
                            </div>
                          </td>
                        );
                      }

                      if (cell.type === "break") {
                        return (
                          <td
                            key={`${dayNum}-${rangeIdx}`}
                            className="px-2 py-2 border-r border-gray-200 text-center min-h-[80px] bg-gray-100"
                          >
                            <div className="h-full flex items-center justify-center">
                              <div className="text-gray-400 text-xs font-semibold tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                BREAK
                              </div>
                            </div>
                          </td>
                        );
                      }

                      if (cell.type === "lunch") {
                        return (
                          <td
                            key={`${dayNum}-${rangeIdx}`}
                            className="px-2 py-2 border-r border-gray-200 text-center min-h-[80px] bg-gray-100"
                          >
                            <div className="h-full flex items-center justify-center">
                              <div className="text-gray-400 text-xs font-semibold tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                LUNCH
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={`${dayNum}-${rangeIdx}`}
                          className="px-2 py-2 border-r border-gray-200 bg-white"
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Classes Message */}
      {!isLoading && settings && !selectedClassId && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CalendarIcon size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">No Classes Scheduled</h2>
          <p className="text-sm text-gray-600">You don't have any classes scheduled yet.</p>
        </div>
      )}
    </div>
  );
}

