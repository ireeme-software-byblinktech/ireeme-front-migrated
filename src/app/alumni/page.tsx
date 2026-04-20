"use client";

import { 
  Users, 
  Trophy, 
  GraduationCap, 
  Calendar,
  Heart,
  Globe,
  Target,
  ArrowRight,
  TrendingUp,
  MapPin,
  Briefcase,
  Award,
  Plus
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AlumniDashboard() {
  return (
    <div className="pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
         <div>
            <h1 className="text-xl font-bold text-gray-900">Alumni Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">Welcome back, John Doe - Class of 2015</p>
         </div>
         <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
               <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Legacy Member</span>
            </div>
         </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard
           label="Alumni Network"
           value="12,482"
           icon={<Users size={20} />}
           trend={{ value: "Global", direction: "up" }}
         />
         <StatCard
           label="Active Applications"
           value="3"
           icon={<Target size={20} />}
           trend={{ value: "Tracked", direction: "up" }}
         />
         <StatCard
           label="Connected Peers"
           value="154"
           icon={<Globe size={20} />}
           trend={{ value: "Network", direction: "up" }}
         />
         <StatCard
           label="Upcoming Events"
           value="5"
           icon={<Calendar size={20} />}
           trend={{ value: "This Month", direction: "up" }}
         />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Applications Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">University Applications</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Track your admission progress</p>
              </div>
              <Link href="/alumni/applications">
                <Button className="h-8 px-3 text-[9px] bg-black text-white rounded-lg">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              <Link href="/alumni/applications/1" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Harvard University</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Public Policy (MPP)</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[8px] font-bold rounded uppercase">In Progress</span>
                </div>
              </Link>
              <Link href="/alumni/applications/2" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900">National University of Singapore</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Computer Science (PhD)</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[8px] font-bold rounded uppercase">Not Started</span>
                </div>
              </Link>
            </div>
            <Link href="/alumni/applications/new" className="block mt-3">
              <button className="w-full h-9 bg-gray-50 hover:bg-black hover:text-white text-gray-600 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-1.5">
                <Plus size={12} /> Add New Application
              </button>
            </Link>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Upcoming Events</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Alumni gatherings and networking</p>
              </div>
              <Link href="/alumni/events">
                <Button className="h-8 px-3 text-[9px] bg-black text-white rounded-lg">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900">10th Year Reunion - Class of 2016</p>
                    <p className="text-[10px] text-gray-500 mt-1">May 25, 2026 • 06:00 PM</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> Kigali Convention Centre
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900">Global Career Mentorship Night</p>
                    <p className="text-[10px] text-gray-500 mt-1">June 02, 2026 • 07:00 PM</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Online (Zoom)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alumni Achievements */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Featured Alumni</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Success stories from our network</p>
              </div>
              <Link href="/alumni/achievements">
                <Button className="h-8 px-3 text-[9px] bg-black text-white rounded-lg">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    SJ
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900">Dr. Sarah Johnson</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Neurosurgeon • Class of 2015</p>
                    <p className="text-[10px] text-gray-600 mt-1.5 line-clamp-2">Pioneering research in minimally invasive neural robotics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-gray-900 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-400">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/alumni/applications/new" className="block">
                <button className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
                  New Application
                </button>
              </Link>
              <Link href="/alumni/directory" className="block">
                <button className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
                  Find Alumni
                </button>
              </Link>
              <Link href="/alumni/events" className="block">
                <button className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
                  Browse Events
                </button>
              </Link>
            </div>
          </div>

          {/* Alumni Directory Preview */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Alumni Near You</h3>
              <Link href="/alumni/directory" className="text-[9px] font-bold text-blue-600 hover:text-black uppercase">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-[9px] font-bold">
                  SJ
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-900">Sarah Johnson</p>
                  <p className="text-[9px] text-gray-500">Neurosurgeon • Boston</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-[9px] font-bold">
                  MU
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-900">Marc Uwase</p>
                  <p className="text-[9px] text-gray-500">AI Researcher • Zurich</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-[9px] font-bold">
                  EC
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-900">Emily Chen</p>
                  <p className="text-[9px] text-gray-500">UX Designer • Singapore</p>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Projects */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Support Projects</h3>
              <Link href="/alumni/donations" className="text-[9px] font-bold text-blue-600 hover:text-black uppercase">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={14} className="text-emerald-600" />
                  <p className="text-xs font-bold text-gray-900">Next-Gen AI Lab</p>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-1.5 mb-2">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <p className="text-[9px] text-gray-600">$145,000 of $200,000 raised</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
