"use client";

import { StatCard } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Users, GraduationCap, ClipboardList, TrendingUp,
  Clock, Award, MessageSquare, ArrowUpRight, AlertTriangle, FileText, ChevronRight, BookOpen, CheckCircle
} from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="pb-10">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-black mb-1">Welcome back, Ms. Johnson</h1>
        <p className="text-[#64748B] text-base">Here's what's happening with your classes today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Students"
          value="78"
          icon={<Users size={24} />}
          progress={75}
          trend={{ value: "3.6k", label: "Across 3 classes", direction: "up" }}
        />
        <StatCard
          label="Classes Today"
          value="5"
          icon={<BookOpen size={24} />}
          progress={60}
          trend={{ value: "2", label: "completed", direction: "up" }}
        />
        <StatCard
          label="Pending Grades"
          value="12"
          icon={<Award size={24} />}
          progress={45}
          trend={{ value: "-12", label: "from yesterday", direction: "down" }}
        />
        <StatCard
          label="Avg. Attendance"
          value="94%"
          icon={<CheckCircle size={24} />}
          progress={94}
          trend={{ value: "+3", label: "this week", direction: "up" }}
        />
      </div>

      {/* Today's Schedule */}
      <div className="mb-10">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Today's Schedule</h2>
          <Link href="/teacher/timetable" className="dashboard-section-link">View Full Schedule</Link>
        </div>
        <div className="schedule-container">
          <div className="schedule-list">
            <div className="schedule-item">
              <div className="schedule-time-box">
                <Clock size={16} className="schedule-time-icon" />
                <span className="schedule-time-text">08:00 AM</span>
              </div>
              <div className="schedule-details">
                <h3 className="schedule-subject">Mathematics</h3>
                <p className="schedule-info">Grade 10-A • Room 204 • 32 students</p>
              </div>
              <div className="status-tag completed">completed</div>
            </div>

            <div className="schedule-item">
              <div className="schedule-time-box">
                <Clock size={16} className="schedule-time-icon" />
                <span className="schedule-time-text">09:30 AM</span>
              </div>
              <div className="schedule-details">
                <h3 className="schedule-subject">Mathematics</h3>
                <p className="schedule-info">Grade 10-B • Room 204 • 28 students</p>
              </div>
              <div className="status-tag completed">completed</div>
            </div>

            <div className="schedule-item">
              <div className="schedule-time-box">
                <Clock size={16} className="schedule-time-icon" />
                <span className="schedule-time-text">11:00 AM</span>
              </div>
              <div className="schedule-details">
                <h3 className="schedule-subject">Algebra II</h3>
                <p className="schedule-info">Grade 11-A • Room 204 • 30 students</p>
              </div>
              <div className="status-tag ongoing">ongoing</div>
            </div>

            <div className="schedule-item">
              <div className="schedule-time-box">
                <Clock size={16} className="schedule-time-icon" />
                <span className="schedule-time-text">01:00 PM</span>
              </div>
              <div className="schedule-details">
                <h3 className="schedule-subject">Calculus</h3>
                <p className="schedule-info">Grade 12-A • Room 204 • 25 students</p>
              </div>
              <div className="status-tag upcoming">upcoming</div>
            </div>

            <div className="schedule-item">
              <div className="schedule-time-box">
                <Clock size={16} className="schedule-time-icon" />
                <span className="schedule-time-text">02:30 PM</span>
              </div>
              <div className="schedule-details">
                <h3 className="schedule-subject">Mathematics</h3>
                <p className="schedule-info">Grade 9-C • Room 204 • 35 students</p>
              </div>
              <div className="status-tag upcoming">upcoming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Assignments and Performance */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        {/* Recent Assignments */}
        <div>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Recent Assignments</h2>
            <Link href="/teacher/assignments" className="dashboard-section-link">View All</Link>
          </div>
          <div className="assignment-card">
            <div className="assignment-header">
              <h3 className="assignment-title">Practice Problems Set 3</h3>
              <span className="assignment-due text-orange-600 font-bold">DRAFT</span>
            </div>
            <p className="assignment-subtitle">Mathematics - Grade 5A</p>
            <div className="assignment-stats">
              <div className="assignment-stat">
                <CheckCircle size={14} className="text-black" />
                <span>0/24 submitted</span>
              </div>
            </div>
            <button className="assignment-btn">Publish Assignment</button>
          </div>

          <div className="assignment-card">
            <div className="assignment-header">
              <h3 className="assignment-title">Homework #4 - Algebraic Equations</h3>
              <span className="assignment-due">Due: Tomorrow, 10:00 AM</span>
            </div>
            <p className="assignment-subtitle">Mathematics - Grade 5B</p>
            <div className="assignment-stats">
              <div className="assignment-stat">
                <CheckCircle size={14} className="text-black" />
                <span>20/26 submitted</span>
              </div>
              <div className="assignment-stat">
                <Award size={14} className="text-black" />
                <span>15 graded</span>
              </div>
            </div>
            <button className="assignment-btn">Grade Submissions</button>
          </div>

          <div className="assignment-card">
            <div className="assignment-header">
              <h3 className="assignment-title">Quiz 5 - Geometry Basics</h3>
              <span className="assignment-due">Due: Dec 20, 2024</span>
            </div>
            <p className="assignment-subtitle">Mathematics - Grade 5A</p>
            <div className="assignment-stats">
              <div className="assignment-stat">
                <CheckCircle size={14} className="text-black" />
                <span>24/24 submitted</span>
              </div>
              <div className="assignment-stat">
                <Award size={14} className="text-black" />
                <span>24 graded</span>
              </div>
            </div>
            <button className="assignment-btn">View Results</button>
          </div>
        </div>

        {/* Class Performance Overview */}
        <div>
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Class Performance Overview</h2>
          </div>

          <div className="performance-item">
            <div className="performance-header">
              <span className="performance-grade">Grade 10-A</span>
              <ArrowUpRight size={16} className="performance-trend-icon" />
            </div>
            <div className="performance-value">87%</div>
            <div className="performance-label">Average Score</div>
            <div className="performance-bar-bg">
              <div className="performance-bar-fill" style={{ width: "87%" }}></div>
            </div>
          </div>

          <div className="performance-item">
            <div className="performance-header">
              <span className="performance-grade">Grade 11-A</span>
              <ArrowUpRight size={16} className="performance-trend-icon" />
            </div>
            <div className="performance-value">82%</div>
            <div className="performance-label">Average Score</div>
            <div className="performance-bar-bg">
              <div className="performance-bar-fill" style={{ width: "82%" }}></div>
            </div>
          </div>

          <div className="performance-item">
            <div className="performance-header">
              <span className="performance-grade">Grade 9-C</span>
              <AlertTriangle size={16} className="text-black" />
            </div>
            <div className="performance-value">68%</div>
            <div className="performance-label">Average Score - Needs Attention</div>
            <div className="performance-bar-bg">
              <div className="performance-bar-fill" style={{ width: "68%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <FileText size={24} className="quick-action-icon" />
            <h3 className="quick-action-title">Create Assignment</h3>
            <p className="quick-action-desc">New homework or test</p>
          </div>
          <div className="quick-action-card">
            <Award size={24} className="quick-action-icon" />
            <h3 className="quick-action-title">Grade Submissions</h3>
            <p className="quick-action-desc">23 pending reviews</p>
          </div>
          <div className="quick-action-card">
            <MessageSquare size={24} className="quick-action-icon" />
            <h3 className="quick-action-title">Send Message</h3>
            <p className="quick-action-desc">Contact students/parents</p>
          </div>
          <div className="quick-action-card">
            <Users size={24} className="quick-action-icon" />
            <h3 className="quick-action-title">View Students</h3>
            <p className="quick-action-desc">Manage class roster</p>
          </div>
        </div>
      </div>
    </div>
  );
}
