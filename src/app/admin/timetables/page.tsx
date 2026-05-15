"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/FormElements";
import { classesApi, subjectsApi } from "@/lib/api/academics";
import { timetablesApi, TimetableSlot } from "@/lib/api/timetables";
import { teachersApi } from "@/lib/api/academics";
import { Plus, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

import { AddSlotModal } from "./AddSlotModal";

export default function AdminTimetablesPage() {
    const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [slots, setSlots] = useState<TimetableSlot[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState<{ day?: number; time?: string }>({});

    const loadTimetable = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
            const data = await timetablesApi.getByClass(selectedClass);
            setSlots(data);
        } catch (err) {
            console.error("Failed to load timetable", err);
        } finally {
            setLoading(false);
        }
    };

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
            loadTimetable();
        } else {
            setSlots([]);
        }
    }, [selectedClass]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this slot?")) return;
        try {
            await timetablesApi.delete(id);
            setSlots(slots.filter(s => s.id !== id));
        } catch (err) {
            alert("Failed to delete slot");
        }
    };

    const openAddModal = (day?: number, time?: string) => {
        setModalContext({ day, time });
        setIsAddModalOpen(true);
    };

    const getSlot = (dayIndex: number, time: string) => {
        return slots.find(s => s.dayOfWeek === dayIndex + 1 && s.startTime === time);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Class Timetables"
                subtitle="Design and manage weekly schedules for all classes."
            />

            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-64">
                    <Select
                        placeholder="Choose Class"
                        options={classes}
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    />
                </div>
                <Button className="gap-2" onClick={() => openAddModal()}>
                    <Plus className="w-4 h-4" /> Add New Slot
                </Button>
            </div>

            <Card>
                <CardBody className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-fixed min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="w-24 p-4 border-r font-bold text-gray-500 text-xs uppercase tracking-wider">Time</th>
                                    {DAYS.map((day) => (
                                        <th key={day} className="p-4 font-bold text-gray-700 text-sm">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {HOURS.map((time) => (
                                    <tr key={time} className="border-b last:border-0 h-24">
                                        <td className="p-4 border-r bg-gray-50/50 text-gray-500 font-medium text-xs flex flex-col items-center justify-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {time}
                                        </td>
                                        {DAYS.map((_, dayIdx) => {
                                            const slot = getSlot(dayIdx, time);
                                            return (
                                                <td key={`${dayIdx}-${time}`} className="p-2 border-r last:border-0 relative group">
                                                    {slot ? (
                                                        <div className="h-full w-full bg-black text-white p-3 rounded-lg shadow-sm flex flex-col justify-between">
                                                            <div>
                                                                <div className="text-xs font-bold opacity-70 mb-1">{slot.subject?.code}</div>
                                                                <div className="text-sm font-bold leading-tight line-clamp-2">{slot.subject?.name}</div>
                                                            </div>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <div className="text-[10px] opacity-60">
                                                                    {slot.teacher?.user.firstName} {slot.teacher?.user.lastName}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete(slot.id)}
                                                                    className="text-red-400 hover:text-red-200 transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openAddModal(dayIdx + 1, time)}
                                                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
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

            <AddSlotModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadTimetable}
                initialClassId={selectedClass}
                initialDay={modalContext.day}
                initialTime={modalContext.time}
            />

            {loading && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-sm">Loading Timetable...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
