"use client";

import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Globe, 
  Clock, 
  Video, 
  Search, 
  Filter,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const EVENTS = [
  {
    id: "1",
    title: "10th Year Reunion - Class of 2016",
    date: "May 25, 2026",
    time: "06:00 PM",
    location: "Kigali Convention Centre",
    type: "Reunion",
    attendees: 120,
    image: "/icons/logo.png"
  },
  {
    id: "2",
    title: "Global Career Mentorship Night",
    date: "June 02, 2026",
    time: "07:00 PM",
    location: "Online (Zoom)",
    type: "Networking",
    attendees: 450,
    isVirtual: true
  },
  {
    id: "3",
    title: "Alumni Sports Day & Picnic",
    date: "June 15, 2026",
    time: "09:00 AM",
    location: "School Sports Complex",
    type: "Social",
    attendees: 85
  }
];

export default function AlumniEventsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Alumni Events</h2>
          <p className="text-sm font-bold text-gray-400 italic">Stay connected through networking, reunions, and global seminars.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white border border-gray-100 rounded-2xl p-1 flex shadow-sm">
              {["All", "Reunions", "Virtual", "Social"].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                >
                  {f}
                </button>
              ))}
           </div>
           <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all text-gray-400 hover:text-black">
              <Filter size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {EVENTS.map((event) => (
          <div key={event.id} className="group relative bg-white rounded-[48px] border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all overflow-hidden cursor-pointer">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex flex-col h-full gap-8">
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full italic">
                     {event.type} {event.isVirtual && "• Virtual"}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-gray-300">
                     <Users size={16} />
                     {event.attendees}+ Registered
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight italic group-hover:text-emerald-500 transition-colors uppercase">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                     <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Calendar size={16} className="text-emerald-500" />
                        {event.date}
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Clock size={16} className="text-emerald-500" />
                        {event.time}
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        {event.isVirtual ? <Video size={16} className="text-blue-500" /> : <MapPin size={16} className="text-emerald-500" />}
                        {event.location}
                     </div>
                  </div>
               </div>

               <div className="mt-auto flex items-center justify-between pt-6 border-t border-dashed border-gray-100">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm uppercase">
                         {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-black border-4 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm italic">
                       +116
                    </div>
                  </div>
                  <Button className="bg-black text-white rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest shadow-xl group-hover:bg-emerald-500 transition-all border-none">
                     Secure Your Spot
                  </Button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[64px] bg-black p-16 relative overflow-hidden text-white shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
         
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="text-5xl font-black italic tracking-tighter leading-tight uppercase">Host your own <br />local chapter?</h2>
               <p className="text-lg font-medium text-gray-400 italic leading-relaxed">
                  Can't make it to Kigali? We'll help you organize a "Blink-Tech Night" in your city. Get funding, branding assets, and connection lists.
               </p>
               <div className="flex gap-4">
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer">
                     <Globe className="text-emerald-400" size={24} />
                     <span className="text-xs font-black uppercase italic tracking-tighter">Open in 42 Cities</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-3xl border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer">
                     <CheckCircle2 className="text-emerald-400" size={24} />
                     <span className="text-xs font-black uppercase italic tracking-tighter">Official Support</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-10 space-y-8">
               <h4 className="text-sm font-black uppercase italic tracking-widest text-emerald-400">Request Recognition</h4>
               <div className="space-y-4">
                  <input type="text" placeholder="City of Residence" className="w-full h-14 bg-white/5 rounded-2xl border border-white/10 px-6 font-bold text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
                  <input type="email" placeholder="Contact Email" className="w-full h-14 bg-white/5 rounded-2xl border border-white/10 px-6 font-bold text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
                  <textarea placeholder="Proposed Date or Event Idea" className="w-full h-32 bg-white/5 rounded-2xl border border-white/10 p-6 font-bold text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all resize-none" />
                  <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase italic rounded-2xl shadow-xl shadow-emerald-500/20 border-none">
                     Submit Proposal
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

