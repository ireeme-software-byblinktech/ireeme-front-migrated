"use client";

import { Modal } from "@/components/ui/Modal";
import { BookOpen, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  type?: string;
}

const handleEnterAsTab = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const container = e.currentTarget.closest('[role="dialog"]') || e.currentTarget.closest('form') || document.body;
    if (container) {
      const focusableElements = Array.from(
        container.querySelectorAll('input, select, textarea, button:not([disabled])')
      ) as HTMLElement[];
      const currentIndex = focusableElements.indexOf(e.currentTarget);
      if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
        focusableElements[currentIndex + 1].focus();
      }
    }
  }
};

const InputField = ({ label, defaultValue, placeholder, className, type }: FieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <input
        type={type || "text"}
        defaultValue={defaultValue}
        placeholder={placeholder || label}
        onKeyDown={handleEnterAsTab}
        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400"
      />
    </div>
  );
};

const SelectField = ({ label, defaultValue, placeholder, className, students }: FieldProps & { students?: RecordModalProps['students'] }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <select
        defaultValue={defaultValue}
        onKeyDown={handleEnterAsTab}
        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none cursor-pointer"
      >
        <option value="">{placeholder || label}</option>
        {students?.map((student) => (
          <option key={student.id} value={student.id}>
            {student.user.firstName} {student.user.lastName} - {student.class?.name || student.studentNumber}
          </option>
        ))}
      </select>
    </div>
  );
};

interface RecordModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  record?: any;
  students?: Array<{
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    studentNumber: string;
    class?: {
      name: string;
    };
  }>;
}

export function AddRecordModal({ open, onClose, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Add Record</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Student Name</label>
            <input
              type="text"
              placeholder="Student Name"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Class</label>
            <input
              type="text"
              placeholder="Class"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Blood Type</label>
              <input
                type="text"
                placeholder="Blood Type"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Allergies</label>
              <input
                type="text"
                placeholder="Allergies"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95"
          >
            CANCEL
          </button>
          <button
            onClick={() => { onConfirm?.(); onClose(); }}
            className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            ADD
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function UpdateRecordModal({ open, onClose, record, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Update Record</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Student Name</label>
            <input
              type="text"
              defaultValue={record?.name || "Amani Samuel"}
              placeholder="Student Name"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Class</label>
            <input
              type="text"
              defaultValue={record?.class || "S5 MCB"}
              placeholder="Class"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Blood Type</label>
              <input
                type="text"
                defaultValue={record?.bloodType || "O+"}
                placeholder="Blood Type"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Allergies</label>
              <input
                type="text"
                defaultValue={record?.allergies || "Peanuts"}
                placeholder="Allergies"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95"
          >
            CANCEL
          </button>
          <button
            onClick={() => { onConfirm?.(); onClose(); }}
            className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            UPDATE
          </button>
        </div>
      </div>
    </Modal>
  );
}
export function ViewRecordModal({ open, onClose, record }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="xl" className="p-0 overflow-hidden rounded-[40px] !border-none !shadow-2xl">
      <div className="bg-white p-">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 px-4 ">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">View Record</h2>
          </div>
          <button onClick={onClose} className="p-1.5 border border-gray-300 rounded-lg text-gray-400 hover:text-black transition-colors">
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-[1px] bg-black mb-10" />

        {/* Informational Card - Space Optimized & Balanced */}
        <div className="border border-gray-200 rounded-[24px] overflow-hidden flex mx-4 p-8 min-w-[450px] min-h-[220px]">
          <div className="flex-[1.4] border-r border-gray-200 pr-10 flex flex-col justify-center gap-5">
            {[
              { label: "Name", value: record?.name || "Amani Samuel" },
              { label: "Class", value: record?.class || "S5 MCB" },
              { label: "Blood Type", value: record?.bloodType || "O+" },
              { label: "Allergies", value: record?.allergies || "Peanuts" }
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-1.5 flex gap-2 whitespace-nowrap">
                <span className="text-[14px] font-black text-gray-900 min-w-max">{item.label}:</span>
                <span className="text-[14px] font-bold text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 pl-12 flex flex-col justify-center gap-2 whitespace-nowrap">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">Saved by :</p>
            <p className="text-[15px] font-black text-gray-900">Moses Byiringiro</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-10 pb-2">
          <button
            onClick={onClose}
            className="w-[280px] py-4 bg-black text-white rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-95"
          >
            CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
}


export function DeleteConfirmationModal({ open, onClose, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[32px] !border-none !shadow-2xl">
      <div className="bg-white p-6 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center text-black">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-[28px] font-black tracking-tight text-gray-900 text-nowrap">Delete Confirmation</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={18} strokeWidth={3} /></div>
          </button>
        </div>

        {/* Body */}
        <div className="text-center py-10">
          <p className="text-[20px] font-bold text-gray-700 leading-relaxed max-w-sm mx-auto">
            "Are you certain you wish to proceed with the deletion of the selected entry?"
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <button
            onClick={onConfirm || onClose}
            className="w-full py-5 bg-black text-white text-[15px] font-black rounded-[20px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddAppointmentModal({ open, onClose, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Add Appointment</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5">
          <InputField label="Name" placeholder="Name" />
          <InputField label="Health Issue" placeholder="Health Issue" />
          <div className="grid grid-cols-2 gap-5">
            <InputField label="Date issued" placeholder="Date issued" type="date" />
            <InputField label="Expected Return" placeholder="Expected Return" type="date" />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <input
              type="checkbox"
              id="return-checkbox"
              onKeyDown={handleEnterAsTab}
              className="w-6 h-6 rounded-md border-2 border-gray-300 accent-black cursor-pointer"
            />
            <label htmlFor="return-checkbox" className="text-[18px] font-black text-gray-700 cursor-pointer">Return</label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95"
          >
            CANCEL
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            ADD
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function UpdateAppointmentModal({ open, onClose, record, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Update Appointment</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-5">
          <InputField label="Name" defaultValue={record?.name || "John Doe"} />
          <InputField label="Health Issue" defaultValue={record?.type?.split(" • ")[1] || "Check-up"} />
          <div className="grid grid-cols-2 gap-5">
            <InputField label="Date issued" defaultValue={record?.date || "02-02-2026"} type="date" />
            <InputField label="Expected Return" defaultValue={record?.expectedReturn || "02-10-2026"} type="date" />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <input
              type="checkbox"
              id="update-return-checkbox"
              onKeyDown={handleEnterAsTab}
              className="w-6 h-6 rounded-md border-2 border-gray-300 accent-black cursor-pointer"
            />
            <label htmlFor="update-return-checkbox" className="text-[18px] font-black text-gray-700 cursor-pointer">Return</label>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95"
          >
            CANCEL
          </button>
          <button
            onClick={() => { onConfirm?.(); onClose(); }}
            className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            UPDATE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ViewAppointmentModal({ open, onClose, record }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="xl" className="p-0 overflow-hidden rounded-[40px] !border-none !shadow-2xl">
      <div className="bg-white p-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">View Appointment</h2>
          </div>
          <button onClick={onClose} className="p-1.5 border border-gray-300 rounded-lg text-gray-400 hover:text-black transition-colors">
            <X size={16} strokeWidth={3} />
          </button>
        </div>
        <div className="mx-4 h-[1px] bg-black mb-10" />
        <div className="border border-gray-200 rounded-[24px] overflow-hidden flex mx-4 p-8 min-h-[220px]">
          <div className="flex-[1.4] border-r border-gray-200 pr-10 flex flex-col justify-center gap-5">
            {[
              { label: "Name", value: record?.name || "John Doe" },
              { label: "Class", value: record?.type?.split(" • ")[0] || "S5 MCB" },
              { label: "Health Issue", value: record?.type?.split(" • ")[1] || "Check-up" },
              { label: "Time", value: record?.time || "09:00 AM" },
              { label: "Status", value: record?.status || "Confirmed" }
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-1.5 flex gap-2 whitespace-nowrap">
                <span className="text-[14px] font-black text-gray-900 min-w-max">{item.label}:</span>
                <span className="text-[14px] font-bold text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 pl-12 flex flex-col justify-center gap-2 whitespace-nowrap">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">Scheduled by :</p>
            <p className="text-[15px] font-black text-gray-900">Moses Byiringiro</p>
          </div>
        </div>
        <div className="flex justify-center mt-10 pb-2">
          <button onClick={onClose} className="w-[280px] py-4 bg-black text-white rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-95">
            CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddMedicationModal({ open, onClose, onConfirm, formData, setFormData }: RecordModalProps & { formData?: any; setFormData?: any }) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Add Medication</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-5">
          <input
            type="text"
            value={formData?.name || ""}
            onChange={(e) => setFormData?.({ ...formData, name: e.target.value })}
            placeholder="Medication Name"
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
          />
          <select
            value={formData?.type || ""}
            onChange={(e) => setFormData?.({ ...formData, type: e.target.value })}
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Type</option>
            <option value="Tablet">Tablet</option>
            <option value="Syrup">Syrup</option>
          </select>
          <div className="grid grid-cols-2 gap-5">
            <input
              type="text"
              value={formData?.quantity || ""}
              onChange={(e) => setFormData?.({ ...formData, quantity: e.target.value })}
              placeholder="Quantity"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
            <input
              type="date"
              value={formData?.expiryDate || ""}
              onChange={(e) => setFormData?.({ ...formData, expiryDate: e.target.value })}
              placeholder="Expiry Date"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <select
            value={formData?.status || "In Stock"}
            onChange={(e) => setFormData?.({ ...formData, status: e.target.value })}
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
          >
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95">
            CANCEL
          </button>
          <button
            onClick={() => { onConfirm?.(); }}
            className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            ADD
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function UpdateMedicationModal({ open, onClose, record, onConfirm, formData, setFormData }: RecordModalProps & { formData?: any; setFormData?: any }) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Update Medication</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-5">
          <input
            type="text"
            value={formData?.name || ""}
            onChange={(e) => setFormData?.({ ...formData, name: e.target.value })}
            placeholder="Medication Name"
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
          />
          <select
            value={formData?.type || ""}
            onChange={(e) => setFormData?.({ ...formData, type: e.target.value })}
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Type</option>
            <option value="Tablet">Tablet</option>
            <option value="Syrup">Syrup</option>
          </select>
          <div className="grid grid-cols-2 gap-5">
            <input
              type="text"
              value={formData?.quantity || ""}
              onChange={(e) => setFormData?.({ ...formData, quantity: e.target.value })}
              placeholder="Quantity"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
            <input
              type="date"
              value={formData?.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ""}
              onChange={(e) => setFormData?.({ ...formData, expiryDate: e.target.value })}
              placeholder="Expiry Date"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <select
            value={formData?.status || "In Stock"}
            onChange={(e) => setFormData?.({ ...formData, status: e.target.value })}
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
          >
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95">
            CANCEL
          </button>
          <button onClick={() => { onConfirm?.(); }} className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10">
            UPDATE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ViewMedicationModal({ open, onClose, record }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="xl" className="p-0 overflow-hidden rounded-[40px] !border-none !shadow-2xl">
      <div className="bg-white p-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">View Medication</h2>
          </div>
          <button onClick={onClose} className="p-1.5 border border-gray-300 rounded-lg text-gray-400 hover:text-black transition-colors">
            <X size={16} strokeWidth={3} />
          </button>
        </div>
        <div className="mx-4 h-[1px] bg-black mb-10" />
        <div className="border border-gray-200 rounded-[24px] overflow-hidden flex mx-4 p-8  min-h-[220px]">
          <div className="flex-[1.4] border-r border-gray-200 pr-10 flex flex-col justify-center gap-5">
            {[
              { label: "Name", value: record?.name || "N/A" },
              { label: "Type", value: record?.type || "N/A" },
              { label: "Quantity", value: record?.quantity || "N/A" },
              { label: "Expiry Date", value: record?.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : "N/A" },
              { label: "Status", value: record?.status || "N/A" }
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-1.5 flex gap-2 whitespace-nowrap">
                <span className="text-[14px] font-black text-gray-900 min-w-max">{item.label}:</span>
                <span className="text-[14px] font-bold text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 pl-12 flex flex-col justify-center gap-2 whitespace-nowrap">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">Stored by :</p>
            <p className="text-[15px] font-black text-gray-900">Nurse</p>
          </div>
        </div>
        <div className="flex justify-center mt-10 pb-2">
          <button onClick={onClose} className="w-[280px] py-4 bg-black text-white rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-95">
            CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddMedicalCaseModal({ open, onClose, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">New Medical Case</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Student Name</label>
            <input
              type="text"
              placeholder="Student Name"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Diagnosis</label>
            <input
              type="text"
              placeholder="Diagnosis"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Date</label>
              <input
                type="date"
                placeholder="Date"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Status</label>
              <input
                type="text"
                placeholder="Status"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95">
            CANCEL
          </button>
          <button
            onClick={() => { onConfirm?.(); onClose(); }}
            className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            CREATE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function UpdateMedicalCaseModal({ open, onClose, record, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Update Case</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Student Name</label>
            <input
              type="text"
              defaultValue={record?.student || "John Doe"}
              placeholder="Student Name"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Diagnosis</label>
            <input
              type="text"
              defaultValue={record?.diagnosis || "In Progress"}
              placeholder="Diagnosis"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Date</label>
              <input
                type="date"
                defaultValue={record?.date || "02-02-2026"}
                placeholder="Date"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Case ID</label>
              <input
                type="text"
                defaultValue={record?.id || "MC-2025-001"}
                placeholder="Case ID"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95">
            CANCEL
          </button>
          <button onClick={onClose} className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10">
            UPDATE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ViewMedicalCaseModal({ open, onClose, record }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="xl" className="p-0 overflow-hidden rounded-[40px] !border-none !shadow-2xl">
      <div className="bg-white p-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">View Medical Case</h2>
          </div>
          <button onClick={onClose} className="p-1.5 border border-gray-300 rounded-lg text-gray-400 hover:text-black transition-colors">
            <X size={16} strokeWidth={3} />
          </button>
        </div>
        <div className="mx-4 h-[1px] bg-black mb-10" />
        <div className="border border-gray-200 rounded-[24px] overflow-hidden flex mx-4 p-8 min-h-[220px]">
          <div className="flex-[1.4] border-r border-gray-200 pr-10 flex flex-col justify-center gap-5">
            {[
              { label: "Case ID", value: record?.id || "MC-2025-001" },
              { label: "Student", value: record?.student || "John Doe" },
              { label: "Class", value: record?.class || "S5 MCB" },
              { label: "Date", value: record?.date || "02-02-2026" },
              { label: "Diagnosis", value: record?.diagnosis || "In Progress" }
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-1.5 flex gap-2 whitespace-nowrap">
                <span className="text-[14px] font-black text-gray-900 min-w-max">{item.label}:</span>
                <span className="text-[14px] font-bold text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 pl-12 flex flex-col justify-center gap-2 whitespace-nowrap">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">Recorded by :</p>
            <p className="text-[15px] font-black text-gray-900">Moses Byiringiro</p>
          </div>
        </div>
        <div className="flex justify-center mt-10 pb-2">
          <button onClick={onClose} className="w-[280px] py-4 bg-black text-white rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-95">
            CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function UpdatePermissionModal({ open, onClose, record, onConfirm, formData, setFormData }: RecordModalProps & { formData?: any; setFormData?: any }) {
  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Update Permission</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-5">
          <input
            type="text"
            value={record?.student?.user ? `${record.student.user.firstName} ${record.student.user.lastName}` : ""}
            disabled
            className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-500 cursor-not-allowed"
          />
          <input
            type="text"
            value={formData?.healthIssue || ""}
            onChange={(e) => setFormData?.({ ...formData, healthIssue: e.target.value })}
            placeholder="Health Issue"
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
          />
          <input
            type="date"
            value={formData?.expectedReturn || ""}
            onChange={(e) => setFormData?.({ ...formData, expectedReturn: e.target.value })}
            placeholder="Expected Return"
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
          />
          <input
            type="text"
            value={formData?.parentGuardian || ""}
            onChange={(e) => setFormData?.({ ...formData, parentGuardian: e.target.value })}
            placeholder="Parent/Guardian"
            onKeyDown={handleEnterAsTab}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
          />
          <textarea
            value={formData?.notes || ""}
            onChange={(e) => setFormData?.({ ...formData, notes: e.target.value })}
            placeholder="Notes (optional)"
            onKeyDown={handleEnterAsTab}
            rows={3}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400 resize-none"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95">
            CANCEL
          </button>
          <button onClick={() => { onConfirm?.(); }} className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10">
            UPDATE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ViewPermissionModal({ open, onClose, record }: RecordModalProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatStatus = (status?: string) => {
    if (!status) return "Active";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const studentName = record?.student?.user 
    ? `${record.student.user.firstName} ${record.student.user.lastName}` 
    : record?.name || "N/A";

  const nurseName = record?.nurse 
    ? `${record.nurse.firstName} ${record.nurse.lastName}` 
    : "Moses Byiringiro";

  const nurseInitials = record?.nurse 
    ? `${record.nurse.firstName[0]}${record.nurse.lastName[0]}` 
    : "MB";

  return (
    <Modal open={open} onClose={onClose} size="lg" className="p-0 overflow-hidden rounded-[40px] !border-none !shadow-2xl">
      <div className="bg-white overflow-y-auto max-h-[80vh] scrollbar-hide">
        {/* Header Ribbon */}
        <div className="bg-gray-50/50 px-10 py-2 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-black">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[24px] font-black text-gray-900 tracking-tight">Permission Details</h2>
              <p className="text-gray-400 font-bold text-sm mt-0.5">Home recovery & release</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-transparent hover:border-gray-200 rounded-xl text-gray-400 hover:text-black hover:bg-white transition-all">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="p-10 space-y-4">
          {/* Main Info Card */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-[28px] p-8 space-y-6 relative overflow-hidden">
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider",
                record?.status === "ACTIVE" ? "bg-black text-white" :
                  record?.status === "OVERDUE" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
              )}>
                {formatStatus(record?.status)}
              </span>
            </div>

            <div>
              <h3 className="text-gray-400 font-bold text-[12px] uppercase tracking-widest mb-1.5">Student</h3>
              <p className="text-gray-900 font-black text-[22px]">{studentName}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-200/60">
              <div>
                <h3 className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-2">Health Issue</h3>
                <p className="text-gray-800 font-bold text-[15px]">{record?.healthIssue || record?.issue || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-2">Parent / Guardian</h3>
                <p className="text-gray-800 font-bold text-[15px]">{record?.parentGuardian || record?.parent || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-200/60">
              <div>
                <h3 className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-2">Date Issued</h3>
                <p className="text-gray-800 font-bold text-[15px]">{formatDate(record?.dateIssued)}</p>
              </div>
              <div>
                <h3 className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-2">Expected Return</h3>
                <p className="text-gray-800 font-bold text-[15px]">{formatDate(record?.expectedReturn)}</p>
              </div>
            </div>

            {/* Notes Section - Only show if notes exist */}
            {record?.notes && (
              <div className="pt-4 border-t border-gray-200/60">
                <h3 className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-2">Notes</h3>
                <p className="text-gray-800 font-medium text-[14px] leading-relaxed">{record.notes}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border border-gray-100 rounded-[20px] p-6 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                {nurseInitials}
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Authorized By</p>
                <p className="text-[14px] font-black text-gray-900">{nurseName}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button onClick={onClose} className="w-full py-5 bg-black text-white rounded-[20px] text-[15px] font-black uppercase tracking-wider shadow-xl shadow-black/10 transition-all hover:opacity-90 active:scale-95">
              DONE
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function AddDocumentModal({ open, onClose, onConfirm }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="lg" className="p-0 overflow-hidden rounded-[32px] !border-none !shadow-2xl">
      <div className="bg-white p-10 space-y-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center text-black">
              <BookOpen size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-[28px] font-black tracking-tight text-gray-900">Upload Document</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={18} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-6">
          <InputField label="Document Name" placeholder="Document Name" />
          <InputField label="Category" placeholder="Category (e.g. Certificate, Medical record)" />
          <div
            tabIndex={0}
            onKeyDown={handleEnterAsTab}
            className="border-2 border-dashed border-gray-200 rounded-[28px] p-12 text-center hover:border-black transition-all cursor-pointer bg-gray-50/50"
          >
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[13px]">Click to upload or drag and drop</p>
            <p className="text-gray-300 text-[11px] font-medium mt-2">Maximum file size 10MB</p>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-5 bg-gray-200 text-black text-[15px] font-black rounded-[20px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95">
            CANCEL
          </button>
          <button
            onClick={() => { onConfirm?.(); onClose(); }}
            className="flex-1 py-5 bg-black text-white text-[15px] font-black rounded-[20px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            UPLOAD
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ViewDocumentModal({ open, onClose, record }: RecordModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="xl" className="p-0 overflow-hidden rounded-[40px] !border-none !shadow-2xl">
      <div className="bg-white p-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">View Document</h2>
          </div>
          <button onClick={onClose} className="p-1.5 border border-gray-300 rounded-lg text-gray-400 hover:text-black transition-colors">
            <X size={16} strokeWidth={3} />
          </button>
        </div>
        <div className="mx-4 h-[1px] bg-black mb-10" />
        <div className="border border-gray-200 rounded-[24px] overflow-hidden flex mx-4 p-8 min-h-[220px]">
          <div className="flex-[1.4] border-r border-gray-200 pr-10 flex flex-col justify-center gap-5">
            {[
              { label: "Name", value: record?.name || "Birth Certificate" },
              { label: "Category", value: record?.category || "Certificate" },
              { label: "File type", value: record?.type || "PDF" },
              { label: "Upload date", value: record?.date || "20-07-2025" },
              { label: "Status", value: record?.status || "Private" }
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-1.5 flex gap-2 whitespace-nowrap">
                <span className="text-[14px] font-black text-gray-900 min-w-max">{item.label}:</span>
                <span className="text-[14px] font-bold text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 pl-12 flex flex-col justify-center gap-4">
            <button className="w-full py-4 border-2 border-black rounded-xl text-[14px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
              Download File
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-10 pb-2">
          <button onClick={onClose} className="w-[280px] py-4 bg-black text-white rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-95">
            CLOSE
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddPermissionModal({ open, onClose, onConfirm, students, formData, setFormData }: RecordModalProps & { formData?: any; setFormData?: any }) {
  return (
    <Modal open={open} onClose={onClose} size="lg" className="p-0 overflow-hidden rounded-[28px] !border-none !shadow-2xl">
      <div className="bg-white p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <BookOpen size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-[24px] font-black tracking-tight text-gray-900">Add Permission</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black">
            <div className="border-2 border-gray-400 rounded-lg p-0.5"><X size={16} strokeWidth={3} /></div>
          </button>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Student</label>
            <select
              value={formData?.studentId || ""}
              onChange={(e) => setFormData?.({ ...formData, studentId: e.target.value })}
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Student</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.user.firstName} {student.user.lastName} - {student.class?.name || student.studentNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Health Issue</label>
              <input
                type="text"
                value={formData?.healthIssue || ""}
                onChange={(e) => setFormData?.({ ...formData, healthIssue: e.target.value })}
                placeholder="Health Issue"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Expected Return</label>
              <input
                type="date"
                value={formData?.expectedReturn || ""}
                onChange={(e) => setFormData?.({ ...formData, expectedReturn: e.target.value })}
                placeholder="Expected Return"
                onKeyDown={handleEnterAsTab}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Parent/Guardian</label>
            <input
              type="text"
              value={formData?.parentGuardian || ""}
              onChange={(e) => setFormData?.({ ...formData, parentGuardian: e.target.value })}
              placeholder="Parent/Guardian"
              onKeyDown={handleEnterAsTab}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Notes (Optional)</label>
            <textarea
              value={formData?.notes || ""}
              onChange={(e) => setFormData?.({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              onKeyDown={handleEnterAsTab}
              rows={3}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[20px] text-[15px] font-medium text-gray-900 focus:outline-none focus:border-black transition-all placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95">
            CANCEL
          </button>
          <button onClick={() => { onConfirm?.(); }} className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10">
            ADD
          </button>
        </div>
      </div>
    </Modal>
  );
}
