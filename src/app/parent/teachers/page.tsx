"use client";

import { useState } from "react";
import { ChildTabs } from "@/components/parent/ChildTabs";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Phone, Mail, Book, Building, User } from "lucide-react";

interface TeacherRecord {
  id: string;
  name: string;
  subject: string;
  classes: string;
  number: string;
  email?: string;
  experience?: string;
}

const TEACHERS_DATA: Record<string, TeacherRecord[]> = {
  "Joel Queen": [
    { id: "1", name: "IZERE Joshua", subject: "Mathematics", classes: "Year 1 A", number: "+(250) 795 589 525", email: "joshua.izere@blink.edu", experience: "8 Years" },
    { id: "2", name: "AMANI Samuel", subject: "Physics", classes: "Year 1 A, B", number: "+(250) 723 545 5454", email: "samuel.amani@blink.edu", experience: "5 Years" },
    { id: "3", name: "HITAYEZU Duff", subject: "Mathematics", classes: "Year 2 A, C , Year 1 C", number: "+(250) 723 545 5454", email: "duff.hitayezu@blink.edu", experience: "12 Years" },
    { id: "4", name: "HITAYEZU Duff", subject: "Physics", classes: "Year 1 A, B", number: "+(250) 723 545 5454", email: "duff.hitayezu@blink.edu", experience: "12 Years" },
    { id: "5", name: "HITAYEZU Duff", subject: "Mathematics", classes: "Year 2 A, C , Year 1 C", number: "+(250) 723 545 5454", email: "duff.hitayezu@blink.edu", experience: "12 Years" },
  ],
  "Jane Doe": [
    { id: "1", name: "MUGISHA Grace", subject: "English", classes: "Year 3 B", number: "+(250) 788 112 233", email: "grace.mugisha@blink.edu", experience: "4 Years" },
  ],
  "Jack Peele": [
    { id: "1", name: "IZERE Joshua", subject: "Chemistry", classes: "Year 4 A", number: "+(250) 795 589 525", email: "joshua.izere@blink.edu", experience: "8 Years" },
  ]
};

const CHILDREN = ["Joel Queen", "Jane Doe", "Jack Peele"];

export default function TeachersPage() {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);

  const columns: Column<TeacherRecord>[] = [
    { 
      key: "name", 
      header: "Teacher's name", 
      width: "25%",
      render: (val) => <span className="font-bold text-gray-900">{String(val)}</span>
    },
    { key: "subject", header: "Subject", width: "20%" },
    { key: "classes", header: "Classes", width: "25%" },
    { key: "number", header: "Number", width: "20%" },
    { 
      key: "action", 
      header: "Action", 
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black text-white hover:bg-gray-800 h-8 px-4 text-xs font-semibold rounded-lg"
          onClick={() => setSelectedTeacher(record)}
        >
          View
        </Button>
      )
    },
  ];

  return (
    <div className="pb-10">
      <ChildTabs 
        children={CHILDREN} 
        selectedChild={selectedChild} 
        onChildChange={setSelectedChild} 
      />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">Teachers & Instructors</h2>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <DataTable 
          columns={columns as any} 
          data={TEACHERS_DATA[selectedChild] as any || []} 
          className="parent-portal-table"
        />
      </div>

      <Modal
        open={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        title="Teacher Profile"
        size="md"
      >
        {selectedTeacher && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[28px] border border-gray-100">
              <div className="w-24 h-24 bg-black rounded-[24px] flex items-center justify-center text-white shadow-lg overflow-hidden">
                <div className="text-3xl font-black uppercase">{selectedTeacher.name.split(' ').map(n => n[0]).join('')}</div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">{selectedTeacher.name}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{selectedTeacher.subject} Lead</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                  ACTIVE TEACHER
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gray-100 rounded-[20px] transition-all hover:border-black/10 group">
                <div className="flex items-center gap-2 mb-2">
                   <Phone size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{selectedTeacher.number}</p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-[20px] transition-all hover:border-black/10 group">
                <div className="flex items-center gap-2 mb-2">
                   <Mail size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{selectedTeacher.email || "n/a"}</p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-[20px] transition-all hover:border-black/10 group">
                <div className="flex items-center gap-2 mb-2">
                   <Building size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Classes</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{selectedTeacher.classes}</p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-[20px] transition-all hover:border-black/10 group">
                <div className="flex items-center gap-2 mb-2">
                   <User size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{selectedTeacher.experience || "Not set"}</p>
              </div>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-[24px] border border-amber-100 flex gap-4">
              <Book size={20} className="text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-amber-900 uppercase mb-1">Teacher's Note</h4>
                <p className="text-xs leading-relaxed text-amber-800 font-medium italic">
                  "Excited to guide your child through {selectedTeacher.subject} this year. Please feel free to reach out via message if you have any academic concerns."
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => setSelectedTeacher(null)}>Close</Button>
              <Button className="bg-black text-white rounded-xl font-bold h-11 px-6">Send Message</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}