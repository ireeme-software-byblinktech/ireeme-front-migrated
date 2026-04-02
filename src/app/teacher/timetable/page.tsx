"use client";

import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const TIMETABLE = [
  { time: "08:00 - 09:00", monday: { subject: "Math 10A", room: "R101" }, tuesday: null, wednesday: { subject: "Math 10B", room: "R101" }, thursday: null, friday: { subject: "Math 11A", room: "R103" } },
  { time: "09:00 - 10:00", monday: null, tuesday: { subject: "Physics 11A", room: "Lab 1" }, wednesday: null, thursday: { subject: "Physics 11A", room: "Lab 1" }, friday: null },
  { time: "10:15 - 11:15", monday: { subject: "Math 10B", room: "R102" }, tuesday: null, wednesday: { subject: "Math 10A", room: "R101" }, thursday: null, friday: null },
  { time: "11:15 - 12:15", monday: null, tuesday: { subject: "Chem 10A", room: "Lab 2" }, wednesday: null, thursday: { subject: "Chem 10A", room: "Lab 2" }, friday: null },
  { time: "14:00 - 15:00", monday: null, tuesday: null, wednesday: { subject: "Biology 11B", room: "R205" }, thursday: null, friday: { subject: "Biology 11B", room: "R205" } },
];

const DAYS = ["time", "monday", "tuesday", "wednesday", "thursday", "friday"];
const DAY_LABELS: Record<string, string> = { time: "", monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" };

type ClassSlot = { subject: string; room: string } | null;
type TimetableRow = { time: string; monday: ClassSlot; tuesday: ClassSlot; wednesday: ClassSlot; thursday: ClassSlot; friday: ClassSlot };

export default function TeacherTimetablePage() {
  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Your weekly class schedule"
        breadcrumbs={[{ label: "Timetable" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<ChevronLeft size={15} />} />
            <span className="text-sm font-medium">March 18 - 22, 2024</span>
            <Button variant="ghost" size="sm" icon={<ChevronRight size={15} />} />
          </div>
        }
      />

      <Card>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {DAYS.map((day) => (
                  <th key={day} style={{ width: day === "time" ? 120 : undefined }}>
                    {DAY_LABELS[day]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMETABLE.map((row, i) => (
                <tr key={i}>
                  <td>
                    <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      {row.time}
                    </span>
                  </td>
                  {(["monday", "tuesday", "wednesday", "thursday", "friday"] as const).map((day) => {
                    const slot = row[day] as ClassSlot;
                    return (
                      <td key={day}>
                        {slot ? (
                          <div style={{
                            background: "var(--color-primary-light)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            border: "1px solid var(--color-primary-muted)"
                          }}>
                            <p className="font-semibold text-sm" style={{ color: "var(--color-primary-dark)" }}>{slot.subject}</p>
                            <p className="text-xs text-muted">{slot.room}</p>
                          </div>
                        ) : (
                          <span style={{ color: "var(--color-border)", fontSize: 12 }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
