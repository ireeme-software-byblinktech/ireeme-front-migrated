"use client";

import { useState } from "react";
import { Search, Filter, MapPin, Briefcase, Mail, MessageSquare, Linkedin, Globe, ChevronRight } from "lucide-react";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";

interface AlumniRecord {
  id: string;
  name: string;
  classYear: string;
  profession: string;
  location: string;
  company: string;
}

const ALUMNI_DIRECTORY: AlumniRecord[] = [
  { id: "1", name: "Sarah Johnson", classYear: "2015", profession: "Neurosurgeon", location: "Boston, USA", company: "General Hospital" },
  { id: "2", name: "Marc Uwase", classYear: "2018", profession: "AI Researcher", location: "Zurich, CH", company: "Google DeepMind" },
  { id: "3", name: "Emily Chen", classYear: "2020", profession: "UX Designer", location: "Singapore", company: "Grab" },
  { id: "4", name: "David Okoro", classYear: "2012", profession: "Civil Engineer", location: "Lagos, Nigeria", company: "BuildIt Ltd" },
  { id: "5", name: "Alice Mwiza", classYear: "2016", profession: "Data Scientist", location: "Kigali, Rwanda", company: "Bank of Kigali" },
  { id: "6", name: "James Bond", classYear: "2007", profession: "Intelligence", location: "London, UK", company: "MI6" },
  { id: "7", name: "Linda Blair", classYear: "2019", profession: "Environmentalist", location: "Toronto, Canada", company: "EcoWorld" },
  { id: "8", name: "Robert Fox", classYear: "2014", profession: "Architect", location: "Paris, France", company: "Fox Design" },
];

export default function AlumniDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classYearFilter, setClassYearFilter] = useState("All");
  const [professionFilter, setProfessionFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const classYears = ["All", ...Array.from(new Set(ALUMNI_DIRECTORY.map(a => a.classYear)))].sort();
  const professions = ["All", ...Array.from(new Set(ALUMNI_DIRECTORY.map(a => a.profession)))].sort();
  const locations = ["All", ...Array.from(new Set(ALUMNI_DIRECTORY.map(a => a.location)))].sort();

  const filteredAlumni = ALUMNI_DIRECTORY.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classYearFilter === "All" || alumni.classYear === classYearFilter;
    const matchesProf = professionFilter === "All" || alumni.profession === professionFilter;
    const matchesLoc = locationFilter === "All" || alumni.location === locationFilter;
    
    return matchesSearch && matchesClass && matchesProf && matchesLoc;
  });

  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const paginatedAlumni = filteredAlumni.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<AlumniRecord>[] = [
    { 
      key: "name", 
      header: "Alumni Name", 
      width: "25%",
      render: (val, record) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black text-[10px]">
            {record.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-black text-gray-900 uppercase text-[10px]">{String(val)}</p>
            <p className="text-[9px] font-bold text-gray-400">Class of {record.classYear}</p>
          </div>
        </div>
      )
    },
    { 
        key: "profession", 
        header: "Profession", 
        width: "20%",
        render: (val, record) => (
            <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-xs">{String(val)}</span>
                <span className="text-[9px] text-gray-400 font-medium italic">@ {record.company}</span>
            </div>
        )
    },
    { 
        key: "location", 
        header: "Location", 
        width: "20%",
        render: (val) => (
            <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin size={11} className="text-gray-400" />
                <span className="text-[11px] font-medium">{String(val)}</span>
            </div>
        )
    },
    { 
      key: "action", 
      header: "Connect", 
      width: "15%",
      align: "center",
      render: () => (
        <div className="flex items-center justify-center gap-1.5">
            <button className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                <MessageSquare size={12} />
            </button>
            <button className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <Linkedin size={12} />
            </button>
        </div>
      )
    },
  ];

  return (
    <div className="pb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Alumni Network</h1>
          <p className="text-xs font-medium text-gray-400">Connect with global leaders from your legacy institution.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm mb-6 space-y-4">
         <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 group w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
               <input 
                type="text" 
                placeholder="Search legacy names or professional roles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
               />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
               <div className="relative group flex-1 md:flex-none">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={12} />
                  <select 
                    value={classYearFilter}
                    onChange={(e) => setClassYearFilter(e.target.value)}
                    className="pl-8 pr-6 h-10 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black cursor-pointer appearance-none min-w-[140px] transition-all"
                  >
                     {classYears.map(year => <option key={year} value={year}>{year === "All" ? "Class: All Years" : `Class: ${year}`}</option>)}
                  </select>
               </div>

               <div className="relative group flex-1 md:flex-none">
                  <Briefcase size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" />
                  <select 
                    value={professionFilter}
                    onChange={(e) => setProfessionFilter(e.target.value)}
                    className="pl-8 pr-6 h-10 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black cursor-pointer appearance-none min-w-[150px] transition-all"
                  >
                     {professions.map(p => <option key={p} value={p}>{p === "All" ? "Role: All Types" : p}</option>)}
                  </select>
               </div>

               <div className="relative group flex-1 md:flex-none">
                  <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" />
                  <select 
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-8 pr-6 h-10 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black cursor-pointer appearance-none min-w-[150px] transition-all"
                  >
                     {locations.map(l => <option key={l} value={l}>{l === "All" ? "Geo: Global" : l}</option>)}
                  </select>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden p-4 pb-2">
        <DataTable 
          columns={columns as any} 
          data={paginatedAlumni as any} 
          className="parent-portal-table border-none"
        />
        
        <div className="flex justify-center py-4">
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredAlumni.length}
                pageSize={itemsPerPage}
            />
        </div>
      </div>

      <div className="mt-6 p-1 w-full bg-black rounded-2xl overflow-hidden">
         <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
               <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                  <Globe size={24} />
               </div>
               <div className="text-white space-y-0.5">
                  <h4 className="text-base font-bold uppercase tracking-tight">Expand Your Network</h4>
                  <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">Join local chapters in 42 countries to meet alumni in your city.</p>
               </div>
            </div>
            <Button className="bg-white text-black hover:bg-emerald-500 hover:text-white rounded-xl px-6 h-10 font-bold text-[10px] uppercase tracking-widest transition-all">
               Explore Chapters
            </Button>
         </div>
      </div>
    </div>
  );
}
