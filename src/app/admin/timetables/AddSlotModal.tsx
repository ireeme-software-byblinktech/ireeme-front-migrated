"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Select, Input } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import { classesApi, subjectsApi, teachersApi } from "@/lib/api/academics";
import { timetablesApi } from "@/lib/api/timetables";

interface AddSlotModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialClassId?: string;
    initialDay?: number;
    initialTime?: string;
}

const DAYS = [
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
];

const HOURS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
].map(h => ({ value: h, label: h }));

export function AddSlotModal({
    open,
    onClose,
    onSuccess,
    initialClassId = "",
    initialDay,
    initialTime = ""
}: AddSlotModalProps) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
    const [subjects, setSubjects] = useState<{ value: string; label: string }[]>([]);
    const [teachers, setTeachers] = useState<{ value: string; label: string }[]>([]);

    const [formData, setFormData] = useState({
        classId: initialClassId,
        subjectId: "",
        teacherId: "",
        dayOfWeek: initialDay?.toString() || "1",
        startTime: initialTime || "08:00",
        room: ""
    });

    useEffect(() => {
        if (open) {
            loadInitialData();
            // Sync with initial props if they change while modal is open (rare but good for cell clicks)
            setFormData(prev => ({
                ...prev,
                classId: initialClassId || prev.classId,
                dayOfWeek: initialDay?.toString() || prev.dayOfWeek,
                startTime: initialTime || prev.startTime
            }));
        }
    }, [open, initialClassId, initialDay, initialTime]);

    useEffect(() => {
        if (formData.classId) {
            loadSubjects(formData.classId);
        } else {
            setSubjects([]);
        }
    }, [formData.classId]);

    async function loadInitialData() {
        setLoading(true);
        try {
            const [classData, teacherData] = await Promise.all([
                classesApi.getAll(),
                teachersApi.getAll()
            ]);
            setClasses(classData.map(c => ({ value: c.id, label: c.name })));
            setTeachers(teacherData.map(t => ({
                value: t.id,
                label: `${t.user.firstName} ${t.user.lastName}`
            })));
        } catch (err) {
            console.error("Failed to load modal data", err);
        } finally {
            setLoading(false);
        }
    }

    async function loadSubjects(classId: string) {
        try {
            const data = await subjectsApi.getByClass(classId);
            setSubjects(data.map(s => ({ value: s.id, label: `${s.code} - ${s.name}` })));
        } catch (err) {
            console.error("Failed to load subjects", err);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await timetablesApi.create({
                ...formData,
                dayOfWeek: parseInt(formData.dayOfWeek)
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            alert(err.message || "Failed to create timetable slot");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Add Timetable Slot"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Class"
                        options={classes}
                        value={formData.classId}
                        onChange={e => setFormData({ ...formData, classId: e.target.value })}
                        required
                        disabled={loading}
                    />
                    <Select
                        label="Subject"
                        options={subjects}
                        value={formData.subjectId}
                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                        required
                        disabled={loading || !formData.classId}
                        placeholder={formData.classId ? "Select Subject" : "Choose Class First"}
                    />
                </div>

                <Select
                    label="Teacher"
                    options={teachers}
                    value={formData.teacherId}
                    onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                    required
                    disabled={loading}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Day"
                        options={DAYS}
                        value={formData.dayOfWeek}
                        onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        required
                    />
                    <Select
                        label="Start Time"
                        options={HOURS}
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        required
                    />
                </div>

                <Input
                    label="Room (Optional)"
                    placeholder="e.g. Room 101, Lab A"
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                />

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={saving} disabled={loading}>
                        Create Slot
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
