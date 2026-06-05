"use client";

import { useMemo } from "react";
import { Card, CardBody } from "@/components/ui";
import { Download, Bell } from "lucide-react";
import { useStudentTimetable } from "@/hooks/api/useStudentAPI";

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

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function TimetablePage() {
  const { data: realSlots, isLoading } = useStudentTimetable();

  const timetableData = useMemo(() => {
    // Initialize empty schedule
    const schedule: DaySchedule[] = DAYS.map(day => ({
      day,
      slots: timeSlots.map(time => ({ time }))
    }));

    if (!realSlots) return schedule;

    // Map API slots to schedule
    realSlots.forEach(slot => {
      // Assuming dayOfWeek: 1 = Monday, ..., 6 = Saturday
      // If 0 = Sunday, 1 = Monday, adapt as needed. Assuming 1=Mon here.
      const dayIndex = slot.dayOfWeek - 1;
      if (dayIndex >= 0 && dayIndex < DAYS.length) {
        // Find matching time slot by startTime (e.g., "08:00")
        const timeIndex = timeSlots.findIndex(ts => ts.startsWith(slot.startTime));
        if (timeIndex !== -1) {
          schedule[dayIndex].slots[timeIndex] = {
            time: timeSlots[timeIndex],
            subject: slot.subject?.name || "Unknown",
            teacher: slot.teacher?.user
              ? `${slot.teacher.user.firstName} ${slot.teacher.user.lastName}`
              : "TBA"
          };
        }
      }
    });

    return schedule;
  }, [realSlots]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Timetable</h1>
          <p className="text-sm text-gray-500">Your weekly class schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800">
            <Bell size={16} />
            Reminders
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900">Current Week</h2>
      </div>

      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="bg-black text-white p-2 text-left font-semibold border border-gray-400 w-24">
                      DAY / HOUR
                    </th>
                    {timeSlots.map((time, index) => (
                      <th key={index} className="bg-black text-white p-2 text-center font-semibold border border-gray-400 text-xs w-28">
                        {time}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {timetableData.map((dayData, dayIndex) => (
                    <tr key={dayIndex}>
                      <td className="bg-gray-50 p-2 font-semibold text-gray-900 border border-gray-400 text-center text-xs">
                        {dayData.day}
                      </td>

                      {dayData.slots.map((slot, slotIndex) => {
                        if (slotIndex === 4) {
                          if (dayIndex === 0) {
                            return (
                              <td key={slotIndex} className="border border-gray-400 p-1 align-middle text-center bg-gray-100" rowSpan={6}>
                                <div className="flex flex-col items-center justify-center h-full">
                                  <div className="text-lg font-bold text-gray-400 leading-tight">L</div>
                                  <div className="text-lg font-bold text-gray-400 leading-tight">U</div>
                                  <div className="text-lg font-bold text-gray-400 leading-tight">N</div>
                                  <div className="text-lg font-bold text-gray-400 leading-tight">C</div>
                                  <div className="text-lg font-bold text-gray-400 leading-tight">H</div>
                                </div>
                              </td>
                            );
                          } else {
                            return null;
                          }
                        }

                        return (
                          <td key={slotIndex} className={`border border-gray-400 p-1 h-16 align-top ${slot.subject ? 'bg-[rgba(235,235,235)]' : ''}`}>
                            {slot.subject ? (
                              <div className="text-xs">
                                <div className="font-medium text-gray-900 mb-1 leading-tight">{slot.subject}</div>
                                <div className="text-[10px] text-gray-500 leading-tight">{slot.teacher}</div>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

