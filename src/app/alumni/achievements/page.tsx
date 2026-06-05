"use client";

import { useState } from "react";
import { 
  Trophy, 
  Star, 
  MapPin, 
  Briefcase, 
  Search, 
  Filter, 
  Award, 
  MessageSquare,
  Link2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const ALUMNI_STORIES = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    class: "2015",
    role: "Neurosurgeon",
    company: "Boston Medical",
    avatar: "SJ",
    storyPreview: "Recognized for pioneering search in minimally invasive neural robotics, Sarah has transformed surgical outcomes for over 500 patients.",
    tags: ["Medical", "Research", "Tech"]
  },
  {
    id: "2",
    name: "Marc Uwase",
    class: "2018",
    role: "AI Researcher",
    company: "Google DeepMind",
    avatar: "MU",
    storyPreview: "Marc is at the forefront of LLM safety research, ensuring that decentralized AI systems remain ethically aligned and transparent.",
    tags: ["AI", "Ethics", "Big Tech"]
  },
  {
    id: "3",
    name: "Emily Chen",
    class: "2020",
    role: "UX Design Lead",
    company: "Grab",
    avatar: "EC",
    storyPreview: "Emily leads accessible design initiatives for the region's largest super-app, impacting millions of lives through inclusive interface strategy.",
    tags: ["Design", "Leadership", "Product"]
  },
  {
    id: "4",
    name: "David Okoro",
    class: "2012",
    role: "Structural Engineer",
    company: "BuildIt Ltd",
    avatar: "DO",
    storyPreview: "Designing the first net-zero skyscrapers in Lagos, David is redefining sustainable urban planning for mega-cities in Africa.",
    tags: ["Engineering", "Sustainability", "Vision"]
  }
];

export default function AlumniAchievementsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Hall of Fame</h2>
          <p className="text-sm font-bold text-gray-400 italic">Honoring the leaders and visionaries who carry our legacy globally.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-gray-100 rounded-3xl p-1 shadow-sm flex items-center">
              {["All", "Tech", "Medical", "Design", "Eng"].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                >
                  {f}
                </button>
              ))}
           </div>
           <Button className="h-12 px-8 bg-black text-white text-xs font-black uppercase italic rounded-3xl shadow-xl hover:bg-gray-800 transition-all border-none">
              Nominate Someone
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {ALUMNI_STORIES.map((alumnus) => (
          <div key={alumnus.id} className="group relative bg-white rounded-[56px] border border-gray-100 p-12 transition-all hover:shadow-2xl hover:scale-[1.01] cursor-pointer overflow-hidden shadow-sm shadow-black/5">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
             
             <div className="relative z-10 flex flex-col h-full items-start">
                <div className="flex w-full items-start justify-between mb-10">
                   <div className="w-24 h-24 bg-black text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-xl group-hover:rotate-6 transition-transform">
                      {alumnus.avatar}
                   </div>
                   <div className="flex gap-2">
                       {alumnus.tags.map((tag, i) => (
                         <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[8px] font-black uppercase tracking-tighter text-gray-400 group-hover:border-black group-hover:text-black transition-all">
                            {tag}
                         </span>
                       ))}
                   </div>
                </div>

                <div className="mb-10 space-y-3">
                   <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">{alumnus.name}</h3>
                      <Award className="text-emerald-500" size={24} />
                   </div>
                   <div className="flex items-center gap-4 text-xs font-black text-emerald-600 uppercase tracking-widest italic decoration-emerald-200 underline">
                      Class of {alumnus.class} • {alumnus.role}
                   </div>
                   <p className="text-sm font-medium text-gray-500 italic leading-relaxed pt-2">
                      "{alumnus.storyPreview}"
                   </p>
                </div>

                <div className="mt-auto w-full flex items-center justify-between pt-8 border-t-2 border-dashed border-gray-50 group-hover:border-gray-100 transition-colors">
                   <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-300" />
                      <span className="text-xs font-bold text-gray-400">{alumnus.company}</span>
                   </div>
                   <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black group-hover:text-emerald-600 transition-colors">
                      Full Story
                      <ChevronRight size={16} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="rounded-[64px] bg-black p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 text-white shadow-3xl">
         <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
         <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
         
         <div className="relative z-10 space-y-8 max-w-xl">
            <h2 className="text-5xl font-black italic tracking-tighter leading-tight uppercase underline decoration-emerald-500 decoration-4">The Global Leaders Circle</h2>
            <p className="text-xl font-medium text-gray-400 italic leading-relaxed">
               We select <span className="text-white font-black">10 Alumni</span> every year to join the elite <span className="text-emerald-400">Leaders Circle</span>. Recipients gain board seats and direct mentorship roles with our high-flyer secondary students.
            </p>
            <div className="flex items-center gap-10">
               <div>
                  <h4 className="text-3xl font-black italic text-emerald-400 leading-none mb-1">120</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Previous Winners</p>
               </div>
               <div>
                  <h4 className="text-3xl font-black italic text-emerald-400 leading-none mb-1">42</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Countries Represented</p>
               </div>
            </div>
         </div>

         <div className="relative z-10 w-full md:w-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[48px] space-y-8">
               <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                     <Target size={24} />
                  </div>
                  <div>
                     <h4 className="text-sm font-black uppercase italic tracking-tighter">Class of 2026 Season</h4>
                     <p className="text-[10px] font-bold text-gray-400">Nominations close in 14 days</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <Button className="w-full h-14 bg-white text-black font-black uppercase italic rounded-2xl shadow-xl shadow-white/5 border-none group">
                     Submit Nomination
                  </Button>
                  <Button variant="outline" className="w-full h-14 bg-transparent border-white/20 text-white font-black uppercase italic rounded-2xl hover:bg-white/10 transition-all gap-2 text-xs">
                     View 2025 Gallery
                     <ExternalLink size={16} />
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

