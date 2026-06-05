"use client";

import { Modal } from "@/components/ui/Modal";
import { ShieldAlert, X } from "lucide-react";

interface FieldProps {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  type?: string;
  as?: "input" | "select" | "textarea";
  options?: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  value?: string;
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

const InputField = ({ label, defaultValue, placeholder, type, as = "input", options, onChange, value }: FieldProps) => {
  if (as === "select") {
    return (
      <div className="space-y-2">
        <select
          value={value || defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleEnterAsTab}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all"
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (as === "textarea") {
    return (
      <div className="space-y-2">
        <textarea
          value={value || defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || label}
          onKeyDown={handleEnterAsTab}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400 min-h-[100px] resize-none"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type={type || "text"}
        value={value || defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || label}
        onKeyDown={handleEnterAsTab}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400"
      />
    </div>
  );
};

interface CaseModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  students?: Array<{ id: string; user: { firstName: string; lastName: string }; studentNumber: string }>;
  offenseTypes?: Array<{ id: string; name: string; pointDeduction: number }>;
  formData?: {
    studentId: string;
    offenseTypeId: string;
    description: string;
    pointsDeduct: number;
  };
  onFormChange?: (field: string, value: any) => void;
}

export function AddDisciplineCaseModal({ 
  open, 
  onClose, 
  onConfirm, 
  students = [], 
  offenseTypes = [],
  formData,
  onFormChange
}: CaseModalProps) {
  const handleOffenseTypeChange = (offenseTypeId: string) => {
    console.log('Offense type selected:', offenseTypeId);
    const offense = offenseTypes.find((o) => o.id === offenseTypeId);
    console.log('Found offense:', offense);
    
    if (offense) {
      // Update both fields at once to avoid race condition
      onFormChange?.("offenseTypeId", offenseTypeId);
      // Use setTimeout to ensure offenseTypeId is set first
      setTimeout(() => {
        onFormChange?.("pointsDeduct", offense.pointDeduction);
      }, 0);
    } else {
      onFormChange?.("offenseTypeId", offenseTypeId);
    }
  };

  // Debug: Log form state
  console.log('Modal form state:', formData);
  console.log('Students count:', students.length);
  console.log('Offense types count:', offenseTypes.length);
  console.log('Button should be enabled:', !!(formData?.studentId && formData?.offenseTypeId && formData?.description));

  return (
    <Modal open={open} onClose={onClose} size="md" className="p-0 overflow-hidden rounded-[24px] !border-none !shadow-2xl">
      <div className="bg-white p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-black">
              <ShieldAlert size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-[20px] font-black tracking-tight text-gray-900">New Case</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-black">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <InputField 
            label="Student" 
            placeholder="Select Student"
            as="select"
            value={formData?.studentId}
            onChange={(value) => onFormChange?.("studentId", value)}
            options={students.map((s) => ({
              value: s.id,
              label: `${s.user?.firstName} ${s.user?.lastName} (${s.studentNumber})`
            }))}
          />

          <InputField 
            label="Offense Type" 
            placeholder="Select Offense Type"
            as="select"
            value={formData?.offenseTypeId}
            onChange={handleOffenseTypeChange}
            options={offenseTypes.map((o) => ({
              value: o.id,
              label: `${o.name} (-${o.pointDeduction} points)`
            }))}
          />

          {offenseTypes.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
              <p className="text-xs text-amber-700 font-bold">
                ⚠️ No offense types. Create one in Settings.
              </p>
            </div>
          )}

          <InputField 
            label="Points" 
            placeholder="Points to deduct"
            type="number"
            value={formData?.pointsDeduct?.toString()}
            onChange={(value) => onFormChange?.("pointsDeduct", parseInt(value) || 0)}
          />

          <InputField 
            label="Description" 
            placeholder="Describe the incident..."
            as="textarea"
            value={formData?.description}
            onChange={(value) => onFormChange?.("description", value)}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-black text-[13px] font-black rounded-xl uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95"
          >
            CANCEL
          </button>
          <button
            onClick={() => { onConfirm?.(); }}
            disabled={!formData?.studentId || !formData?.offenseTypeId || !formData?.description}
            className="flex-1 py-3 bg-black text-white text-[13px] font-black rounded-xl uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CREATE
          </button>
        </div>
      </div>
    </Modal>
  );
}

