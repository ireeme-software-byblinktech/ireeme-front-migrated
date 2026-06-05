"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function DeleteStudentModal({ isOpen, onClose, studentName, onDelete, isDeleting = false }: DeleteStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute left-64 top-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center pointer-events-none p-6">
        <div className="bg-black text-white rounded-2xl w-full max-w-md shadow-2xl pointer-events-auto overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Delete Student?</h2>
            <p className="text-gray-400 text-sm mb-8">
              Are you sure you want to delete <span className="text-white font-bold">{studentName}</span>? This action is permanent.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onClose} 
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                onClick={onDelete} 
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>
      </div>
    </div>
  );
}

