"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Search, BookOpen, Users, FileText, Eye, Download, Edit2, Trash2, Book, FileImage, Presentation, Video, X, CheckCircle, AlertCircle, File } from "lucide-react";
import { StatCard } from "@/components/ui";
import { apiClient } from "@/lib/api/client";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

interface Note {
  id: string;
  type: "PDF" | "VIDEO" | "IMAGE" | "PRESENTATION" | "DOCUMENT";
  title: string;
  description: string;
  subject: string;
  grade: string;
  chapter: string;
  views: number;
  downloads: number;
  fileSize: string;
  fileUrl?: string;
}

interface NotesResponse {
  data: Note[];
}

interface Class {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface ClassesResponse {
  classes: Class[];
}

interface SubjectsResponse {
  data: Subject[];
}

// Toast Component
const Toast = ({ message, type, isVisible }: { message: string; type: "success" | "error"; isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg z-[100] animate-in fade-in slide-in-from-bottom-4 ${
      type === "success" 
        ? "bg-green-50 border border-green-200" 
        : "bg-red-50 border border-red-200"
    }`}>
      {type === "success" ? (
        <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
      ) : (
        <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
      )}
      <span className={`text-[14px] font-medium ${type === "success" ? "text-green-700" : "text-red-700"}`}>
        {message}
      </span>
    </div>
  );
};

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  // If error is a string, return it
  if (typeof error === "string") {
    return error;
  }

  // If error has a message property
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes("network") || message.includes("fetch")) {
      return "Network error. Please check your connection and try again.";
    }
    
    // Validation errors
    if (message.includes("validation") || message.includes("invalid")) {
      return "Please check your input and try again.";
    }
    
    // Not found errors
    if (message.includes("not found") || message.includes("404")) {
      return "The note could not be found. It may have been deleted.";
    }
    
    // Unauthorized errors
    if (message.includes("unauthorized") || message.includes("401")) {
      return "You don't have permission to perform this action.";
    }
    
    // Server errors
    if (message.includes("server") || message.includes("500")) {
      return "Server error. Please try again later.";
    }
    
    // Return original message if it's not too long
    if (error.message.length < 100) {
      return error.message;
    }
  }

  // If error has a response with data
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Default error message
  return "Something went wrong. Please try again.";
};

const DropdownFilter = ({ 
  title, 
  options, 
  selected,
  onChange 
}: { 
  title: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(o => o !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="relative flex-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border-[1.5px] border-gray-200 px-4 py-3 rounded-lg text-[14px] text-gray-500 font-medium text-left"
      >
        {selected.length > 0 ? `${selected.length} selected` : title}
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border-[1px] border-gray-200 rounded-xl shadow-md z-50 py-3 max-h-64 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {options.map(opt => (
              <div 
                key={opt} 
                className="flex items-center gap-3 px-4 cursor-pointer py-2 hover:bg-gray-50 transition-colors"
                onClick={() => toggle(opt)}
              >
                <div className={`w-[20px] h-[20px] rounded-[4px] border-[2px] border-[#CBD5E1] flex items-center justify-center transition-colors flex-shrink-0 ${
                  selected.includes(opt) ? "bg-black" : "bg-white"
                }`}>
                  {selected.includes(opt) && <Check size={14} strokeWidth={3} className="text-white" />}
                </div>
                <span className="text-[14px] font-medium text-[#374151]">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Class Select Dropdown
const ClassSelect = ({ 
  value, 
  onChange, 
  options,
  isLoading 
}: { 
  value: string
  onChange: (value: string) => void
  options: Class[]
  isLoading: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border-[1.5px] border-gray-200 px-4 py-2.5 rounded-lg text-[13px] text-gray-700 font-medium text-left hover:border-gray-300 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Loading classes..." : (value || "Select a class")}
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border-[1px] border-gray-200 rounded-xl shadow-md z-50 py-2 max-h-48 overflow-y-auto">
          {options.length > 0 ? (
            options.map(cls => (
              <button
                key={cls.id}
                onClick={() => {
                  onChange(cls.name);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  value === cls.name 
                    ? "bg-black text-white" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cls.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-[13px] text-gray-500 text-center">
              No classes available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// View Note Modal
const ViewNoteModal = ({ note, isOpen, onClose, onDownload }: { note: Note | null; isOpen: boolean; onClose: () => void; onDownload?: (note: Note) => void }) => {
  const [isViewing, setIsViewing] = useState(false);

  if (!isOpen || !note) return null;

  const handleViewFile = () => {
    if (!note.fileUrl) {
      return;
    }

    // For PDFs, images, and videos, open in new tab
    // For documents/presentations, also open in new tab
    window.open(note.fileUrl, "_blank", "noopener,noreferrer");
    setIsViewing(false);
  };

  // If viewing file, show full-screen viewer
  if (isViewing && note.fileUrl) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full h-full max-w-[90vw] max-h-[90vh] rounded-2xl shadow-xl flex flex-col">
          {/* Viewer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-[18px] font-bold text-gray-900 truncate">{note.title}</h2>
            <button 
              onClick={() => setIsViewing(false)} 
              className="text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Viewer Content */}
          <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
            {note.type === "IMAGE" ? (
              // Image viewer
              <img 
                src={note.fileUrl} 
                alt={note.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : note.type === "VIDEO" ? (
              // Video viewer
              <video 
                src={note.fileUrl}
                controls
                className="max-w-full max-h-full"
              />
            ) : (
              // For PDF, DOCUMENT, PRESENTATION - show message with open button
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-6">
                  {note.type === "PDF" && <FileText size={48} className="text-gray-600" />}
                  {note.type === "DOCUMENT" && <File size={48} className="text-gray-600" />}
                  {note.type === "PRESENTATION" && <Presentation size={48} className="text-gray-600" />}
                </div>
                <p className="text-[16px] font-semibold text-gray-900 mb-2">{note.title}</p>
                <p className="text-[14px] text-gray-600 mb-6">
                  {note.type === "PDF" && "PDF files open in a new tab for better viewing"}
                  {note.type === "DOCUMENT" && "Document files open in a new tab"}
                  {note.type === "PRESENTATION" && "Presentation files open in a new tab"}
                </p>
                <button
                  onClick={handleViewFile}
                  className="bg-black text-white px-6 py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <Eye size={16} /> Open in New Tab
                </button>
              </div>
            )}
          </div>

          {/* Viewer Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-white">
            <button
              onClick={() => setIsViewing(false)}
              className="flex-1 bg-white text-gray-700 border-[1.5px] border-gray-200 py-3 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors"
            >
              Close Viewer
            </button>
            <button
              onClick={() => onDownload?.(note)}
              className="flex-1 bg-black text-white py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Download size={16} /> Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default note info modal
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-xl flex flex-col p-6 max-h-[90vh] overflow-y-auto my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-gray-900">{note.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-bold text-gray-600 uppercase">Type</label>
            <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-[13px] font-medium inline-block mt-1">
              {note.type === "PDF" && <FileText size={12} className="inline mr-1" />}
              {note.type === "IMAGE" && <FileImage size={12} className="inline mr-1" />}
              {note.type === "PRESENTATION" && <Presentation size={12} className="inline mr-1" />}
              {note.type === "VIDEO" && <Video size={12} className="inline mr-1" />}
              {note.type === "DOCUMENT" && <File size={12} className="inline mr-1" />}
              {note.type}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-600 uppercase">Description</label>
            <p className="text-[14px] text-gray-700 mt-2 leading-relaxed">{note.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-bold text-gray-600 uppercase">Subject</label>
              <p className="text-[14px] text-gray-700 mt-1">{note.subject}</p>
            </div>
            <div>
              <label className="text-[12px] font-bold text-gray-600 uppercase">Grade</label>
              <p className="text-[14px] text-gray-700 mt-1">{note.grade}</p>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-600 uppercase">Chapter</label>
            <p className="text-[14px] text-gray-700 mt-1">{note.chapter}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="text-[12px] font-bold text-gray-600 uppercase">Views</label>
              <p className="text-[16px] font-bold text-gray-900 mt-1">{note.views}</p>
            </div>
            <div>
              <label className="text-[12px] font-bold text-gray-600 uppercase">Downloads</label>
              <p className="text-[16px] font-bold text-gray-900 mt-1">{note.downloads}</p>
            </div>
            <div>
              <label className="text-[12px] font-bold text-gray-600 uppercase">File Size</label>
              <p className="text-[16px] font-bold text-gray-900 mt-1">{note.fileSize}</p>
            </div>
          </div>

          {note.fileUrl && (
            <div className="pt-4 border-t border-gray-200">
              <label className="text-[12px] font-bold text-gray-600 uppercase mb-3 block">Uploaded File</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    {note.type === "PDF" && <FileText size={20} className="text-gray-600" />}
                    {note.type === "IMAGE" && <FileImage size={20} className="text-gray-600" />}
                    {note.type === "PRESENTATION" && <Presentation size={20} className="text-gray-600" />}
                    {note.type === "VIDEO" && <Video size={20} className="text-gray-600" />}
                    {note.type === "DOCUMENT" && <File size={20} className="text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{note.title}</p>
                    <p className="text-[12px] text-gray-500">{note.fileSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsViewing(true)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="View file"
                  >
                    <Eye size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDownload?.(note)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Download file"
                  >
                    <Download size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 border-[1.5px] border-gray-200 py-3 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, isDeleting }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void; isDeleting: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-xl flex flex-col p-6 my-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <Trash2 size={24} className="text-red-600" />
        </div>

        <h2 className="text-[18px] font-bold text-gray-900 text-center mb-2">Delete Note?</h2>
        <p className="text-[14px] text-gray-600 text-center mb-6">
          This action cannot be undone. The note will be permanently deleted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-white text-gray-700 border-[1.5px] border-gray-200 py-3 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg text-[14px] font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Note Modal
const EditNoteModal = ({ note, isOpen, onClose, onSave, isSaving, teacherClasses, isLoadingClasses, subjects, isLoadingSubjects }: { note: Note | null; isOpen: boolean; onClose: () => void; onSave: (data: any) => void; isSaving: boolean; teacherClasses: Class[]; isLoadingClasses: boolean; subjects: Subject[]; isLoadingSubjects: boolean }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [chapter, setChapter] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
      setSubject(note.subject);
      setGrade(note.grade);
      setChapter(note.chapter);
      setNewFile(null);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleSubmit = async () => {
    let fileUrl: string | undefined;
    let fileSize: string | undefined;

    // If a new file was selected, upload it first
    if (newFile) {
      try {
        const formData = new FormData();
        formData.append("file", newFile);

        const uploadResponse = await fetch("/api/v1/files/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }

        const { url } = await uploadResponse.json();
        fileUrl = url;
        fileSize = `${(newFile.size / 1024 / 1024).toFixed(1)} MB`;
      } catch (error) {
        console.error("File upload error:", error);
        throw error;
      }
    }

    onSave({
      title,
      description,
      subject,
      grade,
      chapter,
      fileUrl,
      fileSize,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-xl flex flex-col p-6 max-h-[90vh] overflow-y-auto my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-gray-900">Edit Note</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-bold text-gray-600 uppercase">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[14px] mt-1 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-600 uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[14px] mt-1 outline-none focus:border-black resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-bold text-gray-600 uppercase">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[14px] mt-1 outline-none focus:border-black"
              >
                <option value="">Select a subject</option>
                {isLoadingSubjects ? (
                  <option disabled>Loading subjects...</option>
                ) : (
                  subjects.map(subj => (
                    <option key={subj.id} value={subj.name}>
                      {subj.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-bold text-gray-600 uppercase">Grade</label>
              <ClassSelect 
                value={grade}
                onChange={setGrade}
                options={teacherClasses}
                isLoading={isLoadingClasses}
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-600 uppercase">Chapter</label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[14px] mt-1 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-600 uppercase">Replace Document (Optional)</label>
            <div className="border-[2px] border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-3 mt-1">
              <Upload size={20} className="text-gray-400" />
              <div className="text-center">
                <p className="font-bold text-[13px]">{newFile ? newFile.name : "Upload a new file"}</p>
                <p className="text-[12px] text-gray-500 font-medium">Supported formats: Pdf, Docx, Jpg, PNG (Max 10MB)</p>
              </div>
              <input 
                type="file" 
                id="edit-note-upload" 
                className="hidden" 
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="edit-note-upload" className="bg-black text-white px-4 py-2 rounded-[6px] text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                Choose File
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 bg-white text-gray-700 border-[1.5px] border-gray-200 py-3 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={isSaving}
            className="flex-1 bg-black text-white py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TeacherNotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });
  const queryClient = useQueryClient();

  // Track which notes have been viewed/downloaded to prevent duplicate tracking
  const trackedViewsRef = useRef<Set<string>>(new Set());
  const trackedDownloadsRef = useRef<Set<string>>(new Set());

  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newChapter, setNewChapter] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  // Handle file download
  const handleDownload = (note: Note) => {
    if (!note.fileUrl) {
      showToast("File is not available for download", "error");
      return;
    }

    try {
      // Track download only once per note session
      if (!trackedDownloadsRef.current.has(note.id)) {
        trackedDownloadsRef.current.add(note.id);
        apiClient(`/api/v1/notes/${note.id}/increment-downloads`, {
          method: "PATCH",
        }).catch(err => console.error("Failed to track download:", err));
      }

      // Check if URL is valid
      const url = new URL(note.fileUrl);
      
      // Open in new tab
      window.open(note.fileUrl, "_blank", "noopener,noreferrer");
      showToast("Download started", "success");
    } catch (error) {
      showToast("Invalid file URL. Please try again.", "error");
    }
  };

  // Fetch notes from backend
  const { data: notesData, isLoading } = useQuery<NotesResponse>({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/notes");
      return { data: response as Note[] };
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch teacher's assigned classes
  const { data: classesData, isLoading: isLoadingClasses } = useQuery<ClassesResponse>({
    queryKey: ["teacher-classes"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/classes/assigned");
      return response as ClassesResponse;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch subjects from backend
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery<SubjectsResponse>({
    queryKey: ["teacher-subjects"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/subjects/taught");
      // Format the response to match SubjectsResponse interface
      return {
        data: response.subjects || []
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const notes = notesData?.data || [];
  const teacherClasses = classesData?.classes || [];
  const subjects = subjectsData?.data || [];

  // Get filter options from teacher's assigned subjects and classes
  // These are fetched from the backend, ensuring consistency
  const allSubjects = useMemo(() => {
    return subjects.map(s => s.name).filter(s => s);
  }, [subjects]);
  
  const allClasses = useMemo(() => {
    return teacherClasses.map(c => c.name).filter(c => c);
  }, [teacherClasses]);
  
  const allTypes = ["PDF", "VIDEO", "IMAGE", "PRESENTATION", "DOCUMENT"];

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (dto: any) => {
      return await apiClient("/api/v1/notes", {
        method: "POST",
        body: JSON.stringify(dto),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], refetchType: "all" });
      showToast("Note created successfully", "success");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      showToast(message, "error");
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient(`/api/v1/notes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], refetchType: "all" });
      setDeleteConfirmId(null);
      showToast("Note deleted successfully", "success");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      showToast(message, "error");
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiClient(`/api/v1/notes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], refetchType: "all" });
      setIsEditModalOpen(false);
      setEditingNote(null);
      showToast("Note updated successfully", "success");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      showToast(message, "error");
    },
  });

  const handleUpload = async () => {
    if (!newTitle || !newSubject || !newClass || !newChapter || !newFile) {
      showToast("Please fill all required fields and choose a file", "error");
      return;
    }

    try {
      // Step 1: Upload file to S3/MinIO
      const formData = new FormData();
      formData.append("file", newFile);

      const uploadResponse = await fetch("/api/v1/files/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const { key, url } = await uploadResponse.json();
      const fileSizeInMB = (newFile.size / 1024 / 1024).toFixed(1);

      // Step 2: Create note with the file URL
      await createNoteMutation.mutateAsync({
        title: newTitle,
        description: "Newly uploaded resource document...",
        subject: newSubject,
        grade: newClass,
        chapter: newChapter,
        type: "PDF",
        fileUrl: url,
        fileSize: `${fileSizeInMB} MB`,
      });

      setIsModalOpen(false);
      setNewTitle("");
      setNewSubject("");
      setNewClass("");
      setNewChapter("");
      setNewFile(null);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast(message, "error");
    }
  };

  const handleViewNote = (note: Note) => {
    // Track view only once per note session
    if (!trackedViewsRef.current.has(note.id)) {
      trackedViewsRef.current.add(note.id);
      apiClient(`/api/v1/notes/${note.id}/increment-views`, {
        method: "PATCH",
      }).catch(err => console.error("Failed to track view:", err));
    }
    
    setViewingNote(note);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data: any) => {
    if (editingNote) {
      try {
        // Only send the fields that are allowed in the DTO
        const updateData: any = {
          title: data.title,
          description: data.description,
          subject: data.subject,
          grade: data.grade,
          chapter: data.chapter,
        };
        // Only add file-related fields if a new file was uploaded
        if (data.fileUrl) {
          updateData.fileUrl = data.fileUrl;
        }
        if (data.fileSize) {
          updateData.fileSize = data.fileSize;
        }
        await updateNoteMutation.mutateAsync({ id: editingNote.id, data: updateData });
      } catch (error) {
        const message = getErrorMessage(error);
        showToast(message, "error");
      }
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteNoteMutation.mutate(deleteConfirmId);
    }
  };

  // Filter notes based on search and selected filters
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase()) ||
        n.chapter.toLowerCase().includes(search.toLowerCase());
      
      const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(n.subject);
      const matchesClass = selectedClasses.length === 0 || selectedClasses.includes(n.grade);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(n.type);
      
      return matchesSearch && matchesSubject && matchesClass && matchesType;
    });
  }, [notes, search, selectedSubjects, selectedClasses, selectedTypes]);

  const totalViews = filteredNotes.reduce((sum, n) => sum + n.views, 0);
  const totalDownloads = filteredNotes.reduce((sum, n) => sum + n.downloads, 0);
  const uniqueSubjects = new Set(filteredNotes.map(n => n.subject)).size;

  return (
    <div className="pb-10 relative">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-2">Academic Notes</h1>
        <p className="text-gray-500 font-medium text-[15px]">Upload and manage study materials for your students</p>
      </div>

      {/* Action Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white border-[1.5px] border-gray-200 rounded-lg flex items-center px-4 py-2.5">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search notes by title, description, or chapter..."
            className="w-full bg-transparent outline-none text-[14px] text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 rounded-lg text-[14px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Upload size={16} /> Upload Notes
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <DropdownFilter 
          title="All Subjects" 
          options={allSubjects}
          selected={selectedSubjects}
          onChange={setSelectedSubjects}
        />
        <DropdownFilter 
          title="All Classes" 
          options={allClasses}
          selected={selectedClasses}
          onChange={setSelectedClasses}
        />
        <DropdownFilter 
          title="All Types" 
          options={allTypes}
          selected={selectedTypes}
          onChange={setSelectedTypes}
        />
        {(selectedSubjects.length > 0 || selectedClasses.length > 0 || selectedTypes.length > 0) && (
          <button
            onClick={() => {
              setSelectedSubjects([]);
              setSelectedClasses([]);
              setSelectedTypes([]);
            }}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-10 text-[#374151]">
        <StatCard
          label="Total Notes"
          value={String(notes.length)}
          progress={100}
          icon={<BookOpen size={24} />}
          trend={{ value: "3.6%", direction: "up", label: "Across 3 classes" }}
        />
        <StatCard
          label="Total views"
          value={String(totalViews)}
          progress={87}
          icon={<Eye size={24} />}
          trend={{ value: "2.3%", direction: "up", label: "from last term" }}
        />
        <StatCard
          label="Total Downloads"
          value={String(totalDownloads)}
          progress={45}
          icon={<Download size={24} />}
          trend={{ value: "", direction: "up", label: "Assignments to grade" }}
        />
        <StatCard
          label="subjects"
          value={String(uniqueSubjects)}
          progress={65}
          icon={<Book size={24} />}
          trend={{ value: "", direction: "down", label: "Students below 70%" }}
        />
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-12">
            <div className="inline-block animate-spin">
              <BookOpen size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 mt-4">Loading notes...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <div key={note.id} className="bg-white border-[1.5px] border-gray-200 rounded-2xl flex flex-col hover:shadow-sm transition-shadow">
              
              {/* Card Top */}
              <div className="p-6 pb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-[6px] text-[11px] font-bold flex items-center gap-1.5">
                    {note.type === "PDF" && <FileText size={12} />}
                    {note.type === "IMAGE" && <FileImage size={12} />}
                    {note.type === "PRESENTATION" && <Presentation size={12} />}
                    {note.type === "VIDEO" && <Video size={12} />}
                    {note.type === "DOCUMENT" && <File size={12} />}
                    {note.type}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <button onClick={() => handleViewNote(note)} className="hover:text-black transition-colors" title="View"><Eye size={16} /></button>
                    <button onClick={() => handleEditClick(note)} className="hover:text-black transition-colors" title="Edit"><Edit2 size={15} /></button>
                    <button onClick={() => handleDeleteClick(note.id)} className="hover:text-red-500 transition-colors" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>

                <h3 className="font-bold text-[16px] mb-2 text-[#111827] leading-tight">{note.title}</h3>
                <p className="text-[13px] text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                  {note.description}
                </p>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-gray-500 text-[12px] font-medium">
                    <BookOpen size={14} className="text-gray-400" /> {note.subject}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-[12px] font-medium">
                    <Users size={14} className="text-gray-400" /> {note.grade}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-[12px] font-medium">
                    <FileText size={14} className="text-gray-400" /> {note.chapter}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t-[1.5px] border-gray-100 p-4 px-6 flex items-center justify-between mt-auto bg-[#FAFAFA] rounded-b-2xl">
                <div className="flex items-center gap-4 text-gray-500 text-[12px] font-medium">
                  <div className="flex items-center gap-1.5"><Eye size={13} /> {note.views}</div>
                  <div className="flex items-center gap-1.5"><Download size={13} /> {note.downloads}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-500 text-[12px] font-medium">
                    {note.fileSize}
                  </div>
                  <button
                    onClick={() => handleDownload(note)}
                    className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                    title="Download file"
                  >
                    <Download size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white rounded-lg border border-gray-100 p-12 text-center">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No notes found</h3>
            <p className="text-gray-500">
              {search || selectedSubjects.length > 0 || selectedClasses.length > 0 || selectedTypes.length > 0
                ? "No notes match your search or filters"
                : "No notes available yet"}
            </p>
          </div>
        )}
      </div>

      {/* View Note Modal */}
      <ViewNoteModal 
        note={viewingNote} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        onDownload={handleDownload}
      />

      {/* Edit Note Modal */}
      <EditNoteModal
        note={editingNote}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        isSaving={updateNoteMutation.isPending}
        teacherClasses={teacherClasses}
        isLoadingClasses={isLoadingClasses}
        subjects={subjects}
        isLoadingSubjects={isLoadingSubjects}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
        isDeleting={deleteNoteMutation.isPending}
      />

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl flex flex-col p-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-gray-900">Create Note</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-gray-600 uppercase">Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter the Notes Title"
                  className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-black mt-1"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-600 uppercase">Subject</label>
                <select 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-black mt-1"
                >
                  <option value="">Select a subject</option>
                  {isLoadingSubjects ? (
                    <option disabled>Loading subjects...</option>
                  ) : subjects.length > 0 ? (
                    subjects.map(subject => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No subjects available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-600 uppercase">Class</label>
                <select 
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-black mt-1"
                >
                  <option value="">Select a class</option>
                  {isLoadingClasses ? (
                    <option disabled>Loading classes...</option>
                  ) : (
                    teacherClasses.map(cls => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-600 uppercase">Chapter</label>
                <input 
                  type="text" 
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  placeholder="Enter chapter name"
                  className="w-full border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-black mt-1"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-600 uppercase">Upload File</label>
                <div className="border-[2px] border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-3 mt-1">
                  <Upload size={20} className="text-gray-400" />
                  <div className="text-center">
                    <p className="font-bold text-[13px]">{newFile ? newFile.name : "Upload a file"}</p>
                    <p className="text-[12px] text-gray-500 font-medium">Supported formats: PDF, Docx, Jpg, PNG (Max 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    id="note-upload" 
                    className="hidden" 
                    onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="note-upload" className="bg-black text-white px-4 py-2 rounded-[6px] text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                    Choose File
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white text-gray-700 border-[1.5px] border-gray-200 py-3 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={createNoteMutation.isPending}
                className="flex-1 bg-black text-white py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {createNoteMutation.isPending ? "Creating..." : "Create Note"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />
    </div>
  );
}
