"use client";

import { useState } from "react";
import { Upload, Search, BookOpen, Users, FileText, Eye, Download, EyeOff, Edit2, Trash2, Book, FileImage, Presentation, Video } from "lucide-react";
import { StatCard } from "@/components/ui";

import { ChevronDown, ChevronUp, Check } from "lucide-react";

const DropdownFilter = ({ title, options }: { title: string, options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggle = (opt: string) => {
    if (selected.includes(opt)) setSelected(selected.filter(o => o !== opt));
    else setSelected([...selected, opt]);
  };

  return (
    <div className="relative flex-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border-[1.5px] border-gray-200 px-4 py-3 rounded-lg text-[14px] text-gray-500 font-medium text-left"
      >
        {selected.length > 0 ? selected[0] : title}
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border-[1px] border-gray-200 rounded-xl shadow-md z-50 py-3">
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

export default function TeacherNotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState([
    {
      id: 1,
      type: "PDF",
      title: "Introduction to Quadratic Equations",
      desc: "Complete notes covering standard form, vertex form, factoring, and graphing...",
      subject: "Mathematics",
      grade: "Grade 10 - Section A",
      chapter: "Chapter 4: Quadratic Equations",
      views: 145,
      downloads: 89,
      size: "2.4 MB"
    },
    {
      id: 2,
      type: "PDF",
      title: "Cell Structure and Functions",
      desc: "Detailed notes on prokaryotic and eukaryotic cells, organelles, cell...",
      subject: "Biology",
      grade: "Grade 11 - Section B",
      chapter: "Chapter 2: Cell Biology",
      views: 198,
      downloads: 134,
      size: "3.8 MB"
    },
    {
      id: 3,
      type: "VIDEO",
      title: "Newton's Laws of Motion - Video Lecture",
      desc: "Comprehensive video lecture explaining Newton's three laws with real-world...",
      subject: "Physics",
      grade: "Grade 9 - Section A",
      chapter: "Chapter 5: Laws of Motion",
      views: 267,
      downloads: 45,
      size: "156 MB"
    },
    {
      id: 4,
      type: "IMAGE",
      title: "Photosynthesis Process Diagram",
      desc: "High-resolution diagram showing the light and dark reactions of...",
      subject: "Biology",
      grade: "Grade 10 - Section A",
      chapter: "Chapter 6: Photosynthesis",
      views: 312,
      downloads: 201,
      size: "1.2 MB"
    },
    {
      id: 5,
      type: "PRESENTATION",
      title: "Chemical Bonding Presentation",
      desc: "PowerPoint presentation covering ionic, covalent, and metallic bonding with...",
      subject: "Chemistry",
      grade: "Grade 11 - Section A",
      chapter: "Chapter 3: Chemical Bonding",
      views: 178,
      downloads: 92,
      size: "5.6 MB"
    },
    {
      id: 6,
      type: "PDF",
      title: "Trigonometry Formulas and Identities",
      desc: "Comprehensive list of trigonometric formulas, identities, and their derivation...",
      subject: "Mathematics",
      grade: "Grade 11 - Section B",
      chapter: "Chapter 7: Trigonometry",
      views: 223,
      downloads: 156,
      size: "1.8 MB"
    }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!newTitle || !newSubject || !newClass || !newFile) {
      alert("Please fill all required fields and choose a file");
      return;
    }

    const newNote = {
      id: Date.now(),
      type: "PDF",
      title: newTitle,
      desc: "Newly uploaded resource document...",
      subject: newSubject,
      grade: newClass,
      chapter: "General",
      views: 0,
      downloads: 0,
      size: "1.0 MB"
    };

    setNotes([newNote, ...notes]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewSubject("");
    setNewClass("");
    setNewFile(null);
  };

  const handleDelete = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };


  const totalViews = notes.reduce((sum, n) => sum + n.views, 0);
  const totalDownloads = notes.reduce((sum, n) => sum + n.downloads, 0);
  const uniqueSubjects = new Set(notes.map(n => n.subject)).size;

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
        <DropdownFilter title="All Subjects" options={["Mathematics", "Biology", "Physics", "Chemistry"]} />
        <DropdownFilter title="All Classes" options={["Grade 9 - Section A", "Grade 10 - Section A", "Grade 11 - Section B"]} />
        <DropdownFilter title="All Types" options={["PDF", "VIDEO", "IMAGE", "PRESENTATION"]} />
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
        {notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase())).map(note => (
          <div key={note.id} className="bg-white border-[1.5px] border-gray-200 rounded-2xl flex flex-col hover:shadow-sm transition-shadow">
            
            {/* Card Top */}
            <div className="p-6 pb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-[6px] text-[11px] font-bold flex items-center gap-1.5">
                  {note.type === "PDF" && <FileText size={12} />}
                  {note.type === "IMAGE" && <FileImage size={12} />}
                  {note.type === "PRESENTATION" && <Presentation size={12} />}
                  {note.type === "VIDEO" && <Video size={12} />}
                  {note.type}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <button className="hover:text-black transition-colors"><Eye size={16} /></button>
                  <button className="hover:text-black transition-colors"><Edit2 size={15} /></button>
                  <button onClick={() => handleDelete(note.id)} className="hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>

              <h3 className="font-bold text-[16px] mb-2 text-[#111827] leading-tight">{note.title}</h3>
              <p className="text-[13px] text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                {note.desc}
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
              <div className="text-gray-500 text-[12px] font-medium">
                {note.size}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Upload Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-[500px] rounded-2xl shadow-xl flex flex-col p-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-gray-900">Request permission</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <Trash2 size={20} className="hidden" /> {/* visually hidden for layout if needed, but we just use purely text "X" standard */}
                <span className="text-xl">×</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[13px] font-bold text-gray-900">Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter the Notes Title"
                  className="border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[13px] font-bold text-gray-900">Subject</label>
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter Subject Name"
                  className="border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-[13px] font-bold text-gray-900">Class*</label>
              <input 
                type="text" 
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                placeholder="Enter Target Class"
                className="border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-[13px] outline-none"
              />
            </div>

            {/* Upload Area */}
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[13px] font-bold text-gray-900">Upload The Notes*</label>
              <div className="border-[2px] border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3">
                <Upload size={24} className="text-gray-400" />
                <div className="text-center">
                  <p className="font-bold text-[14px]">Upload the file</p>
                  <p className="text-[12px] text-gray-500 font-medium">Supported formats: Pdf, Docx, Jpg, PNG(Max 10MB)</p>
                </div>
                <input 
                  type="file" 
                  id="note-upload" 
                  className="hidden" 
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="note-upload" className="bg-black text-white px-6 py-3 mt-2 rounded-[6px] text-[14px] font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  {newFile ? newFile.name : "Choose file"}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handleUpload}
                className="bg-black text-white w-[120px] py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity"
              >
                Request
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-white text-gray-700 border-[1.5px] border-gray-200 w-[120px] py-3 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors"
               >
                cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
