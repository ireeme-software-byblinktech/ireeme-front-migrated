"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Select, Input } from "@/components/ui/FormElements";
import { classesApi, subjectsApi, studentsApi, Student } from "@/lib/api/academics";
import { attendancesApi } from "@/lib/api/attendances";
import { Check, X, Clock, AlertCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";


export default function AdminAttendancesPage() {
    const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
    const [subjects, setSubjects] = useState<{ value: string; label: string }[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadClasses() {
            try {
                const data = await classesApi.getAll();
                setClasses(data.map(c => ({ value: c.id, label: c.name })));
            } catch (err) {
                console.error("Failed to load classes", err);
            }
        }
        loadClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            async function loadSubjectsAndStudents() {
                setLoading(true);
                try {
                    const [subjData, studData] = await Promise.all([
                        subjectsApi.getByClass(selectedClass),
                        studentsApi.getByClass(selectedClass)
                    ]);
                    setSubjects(subjData.map(s => ({ value: s.id, label: s.name })));
                    setStudents(studData);

                    // Reset attendance data for new class
                    const initialData: Record<string, string> = {};
                    studData.forEach(s => initialData[s.id] = "PRESENT");
                    setAttendanceData(initialData);
                } catch (err) {
                    console.error("Failed to load class details", err);
                } finally {
                    setLoading(false);
                }
            }
            loadSubjectsAndStudents();
        } else {
            setSubjects([]);
            setStudents([]);
        }
    }, [selectedClass]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        if (!selectedClass || !selectedSubject || !selectedDate) {
            alert("Please select class, subject and date");
            return;
        }

        setSaving(true);
        try {
            const records = Object.entries(attendanceData).map(([studentId, status]) => ({
                studentId,
                status,
            }));

            await attendancesApi.markBulk({
                classId: selectedClass,
                subjectId: selectedSubject,
                date: selectedDate,
                records
            });

            alert("Attendance marked successfully");
        } catch (err: any) {
            alert(err.message || "Failed to save attendance");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Attendance Management"
                subtitle="Mark and track student attendance for classes and subjects."
            />

            <Card>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Select
                            label="Select Class"
                            placeholder="Choose a class"
                            options={classes}
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        />
                        <Select
                            label="Subject"
                            placeholder="Choose a subject"
                            options={subjects}
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedClass}
                        />
                        <Input
                            label="Date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </CardBody>
            </Card>

            {selectedClass && (
                <Card>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-bottom">
                                        <th className="p-4 font-bold text-gray-700">Student Name</th>
                                        <th className="p-4 font-bold text-gray-700">Student ID</th>
                                        <th className="p-4 font-bold text-gray-700 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-gray-500">Loading students...</td>
                                        </tr>
                                    ) : students.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-gray-500">No students found in this class.</td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student.id} className="border-bottom hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900">
                                                        {student.user.firstName} {student.user.lastName}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-500 font-mono text-xs">{student.studentNumber}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {[
                                                            { id: "PRESENT", icon: Check, color: "text-green-600", bg: "bg-green-100", activeBg: "bg-green-600", label: "P" },
                                                            { id: "ABSENT", icon: X, color: "text-red-600", bg: "bg-red-100", activeBg: "bg-red-600", label: "A" },
                                                            { id: "LATE", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", activeBg: "bg-yellow-600", label: "L" },
                                                            { id: "EXCUSED", icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-100", activeBg: "bg-blue-600", label: "E" }
                                                        ].map((status) => (
                                                            <button
                                                                key={status.id}
                                                                onClick={() => handleStatusChange(student.id, status.id)}
                                                                title={status.id}
                                                                className={cn(
                                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all border",
                                                                    attendanceData[student.id] === status.id
                                                                        ? cn(status.activeBg, "text-white border-transparent")
                                                                        : cn("bg-white text-gray-400 border-gray-200 hover:border-gray-300")
                                                                )}
                                                            >
                                                                <status.icon className="w-5 h-5" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={saving || students.length === 0}
                                loading={saving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Attendance
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}