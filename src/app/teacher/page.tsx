"use client";

import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import {
  Users, TrendingUp,
  Clock, Award, MessageSquare, ArrowUpRight, AlertTriangle, FileText, BookOpen, CheckCircle
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface DashboardStats {
  totalStudents: number;
  classesToday: number;
  pendingGrades: number;
  avgAttendance: number;
}

interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  class: string;
  room: string;
  studentCount: number;
  status: "completed" | "ongoing" | "upcoming";
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  submitted: number;
  total: number;
  graded: number;
  status: "draft" | "active" | "graded";
}

interface ClassPerformance {
  className: string;
  averageScore: number;
  trend: "up" | "down" | "flat";
  needsAttention: boolean;
}

interface CurrentUser {
  firstName: string;
  lastName: string;
  email: string;
}

export default function TeacherDashboard() {
  // Fetch current user
  const { data: user } = useQuery<CurrentUser>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/auth/me");
      return response as CurrentUser;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/dashboard/stats");
      return response as DashboardStats;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch today's schedule
  const { data: scheduleData, isLoading: scheduleLoading } = useQuery<{ slots: ScheduleItem[] }>({
    queryKey: ["timetable", "today"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/timetable/today");
      return response as { slots: ScheduleItem[] };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch recent assignments
  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery<{ data: Assignment[] }>({
    queryKey: ["assignments", { limit: 3 }],
    queryFn: async () => {
      const response = await apiClient("/api/v1/assignments?limit=3");
      return response as { data: Assignment[] };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch class performance
  const { data: performanceData, isLoading: performanceLoading } = useQuery<{ classes: ClassPerformance[] }>({
    queryKey: ["teachers", "performance"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/performance");
      return response as { classes: ClassPerformance[] };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isLoading = statsLoading || scheduleLoading || assignmentsLoading || performanceLoading;
  const schedule = scheduleData?.slots || [];
  const assignments = assignmentsData?.data || [];
  const performance = performanceData?.classes || [];
  const teacherName = user?.firstName || "Teacher";

  if (isLoading) {
    return (
      <div className="pb-10">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded-lg w-96 animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="h-2 bg-gray-100 rounded-full w-full"></div>
            </div>
          ))}
        </div>

        {/* Schedule Skeleton */}
        <div className="mb-10">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-48"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-black mb-1">Welcome back, {teacherName}</h1>
        <p className="text-[#64748B] text-base">Here's what's happening with your classes today</p>
      </div>

      {/* Stats Grid */}
      {stats ? (
        <div className="grid grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Students"
            value={stats.totalStudents.toString()}
            icon={<Users size={24} />}
            progress={Math.min(stats.totalStudents / 100 * 100, 100)}
            trend={{ value: stats.totalStudents.toString(), label: "Across all classes", direction: "up" }}
          />
          <StatCard
            label="Classes Today"
            value={stats.classesToday.toString()}
            icon={<BookOpen size={24} />}
            progress={60}
            trend={{ value: "2", label: "completed", direction: "up" }}
          />
          <StatCard
            label="Pending Grades"
            value={stats.pendingGrades.toString()}
            icon={<Award size={24} />}
            progress={Math.min(stats.pendingGrades / 50 * 100, 100)}
            trend={{ value: stats.pendingGrades.toString(), label: "to review", direction: "down" }}
          />
          <StatCard
            label="Avg. Attendance"
            value={`${stats.avgAttendance}%`}
            icon={<CheckCircle size={24} />}
            progress={stats.avgAttendance}
            trend={{ value: "+3", label: "this week", direction: "up" }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-100 rounded w-16 mb-4"></div>
              <div className="h-2 bg-gray-50 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Today's Schedule */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Today's Schedule</h2>
          <Link href="/teacher/timetable" className="text-sm font-bold text-gray-600 hover:text-black transition-colors">
            View Full Schedule →
          </Link>
        </div>

        {schedule.length > 0 ? (
          <div className="space-y-3">
            {schedule.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-lg">
                    <Clock size={16} className="text-gray-400 mb-1" />
                    <span className="text-sm font-bold text-gray-700">{item.time}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{item.subject}</h3>
                    <p className="text-sm text-gray-500">{item.class} • {item.room} • {item.studentCount} students</p>
                  </div>
                </div>
                <Badge
                  variant={item.status === "completed" ? "success" : item.status === "ongoing" ? "warning" : "info"}
                  className="capitalize"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Clock size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No classes scheduled for today</p>
          </div>
        )}
      </div>

      {/* Two Column Layout: Assignments and Performance */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        {/* Recent Assignments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">Recent Assignments</h2>
            <Link href="/teacher/assignments" className="text-sm font-bold text-gray-600 hover:text-black transition-colors">
              View All →
            </Link>
          </div>

          {assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-black text-sm">{assignment.title}</h3>
                    <Badge
                      variant={assignment.status === "draft" ? "warning" : assignment.status === "graded" ? "success" : "info"}
                      className="capitalize text-xs"
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{assignment.subject} - {assignment.class}</p>
                  <div className="flex gap-4 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-gray-400" />
                      <span className="text-gray-600">{assignment.submitted}/{assignment.total} submitted</span>
                    </div>
                    {assignment.graded > 0 && (
                      <div className="flex items-center gap-1">
                        <Award size={12} className="text-gray-400" />
                        <span className="text-gray-600">{assignment.graded} graded</span>
                      </div>
                    )}
                  </div>
                  <button className="w-full py-2 px-3 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-900 transition-colors">
                    {assignment.status === "draft" ? "Publish" : assignment.graded < assignment.submitted ? "Grade" : "View Results"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <FileText size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No assignments yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first assignment to get started</p>
            </div>
          )}
        </div>

        {/* Class Performance Overview */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4">Class Performance Overview</h2>

          {performance.length > 0 ? (
            <div className="space-y-4">
              {performance.map((perf, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-black text-sm">{perf.className}</span>
                    {perf.trend === "up" && <ArrowUpRight size={16} className="text-green-600" />}
                    {perf.trend === "down" && <ArrowUpRight size={16} className="text-red-600 rotate-180" />}
                    {perf.needsAttention && <AlertTriangle size={16} className="text-orange-600" />}
                  </div>
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-black">{perf.averageScore}%</div>
                    <p className="text-xs text-gray-500">Average Score {perf.needsAttention && "- Needs Attention"}</p>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${perf.averageScore >= 80 ? "bg-green-500" : perf.averageScore >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${perf.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <TrendingUp size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No performance data yet</p>
              <p className="text-xs text-gray-400 mt-1">Grade submissions to see class performance</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          <Link href="/teacher/assignments/create" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors text-center group">
            <FileText size={24} className="mx-auto text-gray-400 group-hover:text-black transition-colors mb-3" />
            <h3 className="font-bold text-black text-sm mb-1">Create Assignment</h3>
            <p className="text-xs text-gray-500">New homework or test</p>
          </Link>
          <Link href="/teacher/grades" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors text-center group">
            <Award size={24} className="mx-auto text-gray-400 group-hover:text-black transition-colors mb-3" />
            <h3 className="font-bold text-black text-sm mb-1">Grade Submissions</h3>
            <p className="text-xs text-gray-500">{stats?.pendingGrades || 0} pending</p>
          </Link>
          <Link href="/teacher/messages" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors text-center group">
            <MessageSquare size={24} className="mx-auto text-gray-400 group-hover:text-black transition-colors mb-3" />
            <h3 className="font-bold text-black text-sm mb-1">Send Message</h3>
            <p className="text-xs text-gray-500">Contact students/parents</p>
          </Link>
          <Link href="/teacher/students" className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors text-center group">
            <Users size={24} className="mx-auto text-gray-400 group-hover:text-black transition-colors mb-3" />
            <h3 className="font-bold text-black text-sm mb-1">View Students</h3>
            <p className="text-xs text-gray-500">Manage class roster</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
