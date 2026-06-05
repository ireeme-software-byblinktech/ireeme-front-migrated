"use client";

import { Card, CardBody } from "@/components/ui";
import { Download, Bell } from "lucide-react";

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
      { time: "12:00 - 13:00" }, // This will be lunch (handled by rowspan)
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
      { time: "12:00 - 13:00" }, // Lunch (handled by rowspan)
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
      { time: "12:00 - 13:00" }, // Lunch (handled by rowspan)
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
      { time: "12:00 - 13:00" }, // Lunch (handled by rowspan)
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
      { time: "12:00 - 13:00" }, // Lunch (handled by rowspan)
      { time: "13:00 - 14:00", subject: "History", teacher: "Mr. Davis" },
      { time: "14:00 - 15:00" },
      { time: "15:00 - 16:00" }
    ]
  },
  {
    day: "SATURDAY",
    slots: [
      { time: "08:00 - 09:00" },
      { time: "09:00 - 10:00" },
      { time: "10:00 - 11:00" },
      { time: "11:00 - 12:00" },
      { time: "12:00 - 13:00" }, // Lunch (handled by rowspan)
      { time: "13:00 - 14:00" },
      { time: "14:00 - 15:00" },
      { time: "15:00 - 16:00" }
    ]
  }
];

export default function TimetablePage() {
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

      {/* Week Range */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900">Nov 24 - Nov 28, 2025</h2>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-fixed">
              {/* Header Row */}
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
              
              {/* Body Rows */}
              <tbody>
                {timetableData.map((dayData, dayIndex) => (
                  <tr key={dayIndex}>
                    {/* Day Column */}
                    <td className="bg-gray-50 p-2 font-semibold text-gray-900 border border-gray-400 text-center text-xs">
                      {dayData.day}
                    </td>
                    
                    {/* Time Slot Columns */}
                    {dayData.slots.map((slot, slotIndex) => {
                      // Special handling for lunch column (12:00-13:00)
                      if (slotIndex === 4) {
                        // Only render lunch cell for the first row (Monday)
                        if (dayIndex === 0) {
                          return (
                            <td key={slotIndex} className="border border-gray-400 p-1 align-middle text-center" rowSpan={6}>
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
                          // Skip lunch cell for other rows since it's spanned
                          return null;
                        }
                      }
                      
                      return (
                        <td key={slotIndex} className="border border-gray-400 p-1 h-16 align-top">
                          {slot.subject ? (
                            <div className="text-xs">
                              <div className="font-medium text-gray-900 mb-1 leading-tight">{slot.subject}</div>
                              <div className="text-xs text-gray-500 leading-tight">{slot.teacher}</div>
                            </div>
                          ) : (
                            // Empty cell
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
        </CardBody>
      </Card>
    </div>
  );
}

