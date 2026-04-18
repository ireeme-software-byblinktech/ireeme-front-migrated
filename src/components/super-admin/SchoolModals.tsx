"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";

interface SchoolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    initialData?: any;
    mode: "add" | "edit";
}

export function SchoolModal({ isOpen, onClose, onConfirm, initialData, mode }: SchoolModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        dateJoined: "",
        totalStudents: "",
        totalStaff: "",
        status: "Active"
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: "",
                code: "",
                dateJoined: new Date().toISOString().split('T')[0],
                totalStudents: "",
                totalStaff: "",
                status: "Active"
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === "add" ? "Add New School" : "Edit School"}
            className="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="School Name"
                        placeholder="e.g. Rwanda Coding Academy"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="School Code"
                        placeholder="e.g. 12090857063"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                    <Input
                        label="Date Joined"
                        type="date"
                        value={formData.dateJoined}
                        onChange={(e) => setFormData({ ...formData, dateJoined: e.target.value })}
                        required
                    />
                    <Select
                        label="Status"
                        options={[
                            { value: "Active", label: "Active" },
                            { value: "Inactive", label: "Inactive" }
                        ]}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <Input
                        label="Total Students"
                        type="number"
                        placeholder="e.g. 800"
                        value={formData.totalStudents}
                        onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
                        required
                    />
                    <Input
                        label="Total Staff"
                        type="number"
                        placeholder="e.g. 800"
                        value={formData.totalStaff}
                        onChange={(e) => setFormData({ ...formData, totalStaff: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} type="button" className="px-6">
                        Cancel
                    </Button>
                    <Button type="submit" className="px-8 bg-black text-white hover:bg-black/90">
                        {mode === "add" ? "Create School" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
