import { PageHeader } from "@/components/ui/Shared";
import { StatCard } from "@/components/ui/Card";
import { GraduationCap, BookOpen, FileText, BarChart2, Clock, Users, TrendingUp } from "lucide-react";

// Mock data - in a real app, this would come from an API or database
const studentStats = {
  totalSubjects: { value: 15, change: 3.6, period: "This month" },
  totalAssignments: { value: 30, change: 3.6, period: "This month" },
  totalNotes: { value: 30, change: 3.6, period: "This month" },
  totalReports: { value: 30, change: 3.6, period: "This month" },
  attendanceRate: { value: 94, change: 1.2, period: "This month" },
  classRank: { value: 5, change: 2, period: "This month" },
  studyHours: { value: 42, change: 5.2, period: "This week" }
};

export default function StudentDashboard() {
  return (
    <div>
      <PageHeader 
        title="Student Dashboard" 
        subtitle="Your academic overview" 
      />
      
      <div className="stats-grid">
        <StatCard
          label="Total Subjects"
          value={studentStats.totalSubjects.value.toString()}
          icon={<GraduationCap size={18} />}
          progress={75}
          trend={{ 
            value: studentStats.totalSubjects.change.toString(), 
            direction: "up", 
            label: studentStats.totalSubjects.period 
          }}
        />
        
        <StatCard
          label="Total Assignments"
          value={studentStats.totalAssignments.value.toString()}
          icon={<BookOpen size={18} />}
          progress={80}
          trend={{ 
            value: studentStats.totalAssignments.change.toString(), 
            direction: "up", 
            label: studentStats.totalAssignments.period 
          }}
        />
        
        <StatCard
          label="Total Notes"
          value={studentStats.totalNotes.value.toString()}
          icon={<FileText size={18} />}
          progress={65}
          trend={{ 
            value: studentStats.totalNotes.change.toString(), 
            direction: "up", 
            label: studentStats.totalNotes.period 
          }}
        />
        
        <StatCard
          label="Total Reports"
          value={studentStats.totalReports.value.toString()}
          icon={<BarChart2 size={18} />}
          progress={90}
          trend={{ 
            value: studentStats.totalReports.change.toString(), 
            direction: "up", 
            label: studentStats.totalReports.period 
          }}
        />

        <StatCard
          label="Attendance Rate"
          value={`${studentStats.attendanceRate.value}%`}
          icon={<Clock size={18} />}
          progress={studentStats.attendanceRate.value}
          trend={{ 
            value: `${studentStats.attendanceRate.change}%`, 
            direction: "up", 
            label: studentStats.attendanceRate.period 
          }}
        />

        <StatCard
          label="Class Rank"
          value={`${studentStats.classRank.value}th`}
          icon={<Users size={18} />}
          progress={85}
          trend={{ 
            value: studentStats.classRank.change.toString(), 
            direction: "up", 
            label: studentStats.classRank.period 
          }}
        />

        <StatCard
          label="Study Hours"
          value={studentStats.studyHours.value.toString()}
          icon={<TrendingUp size={18} />}
          progress={70}
          trend={{ 
            value: studentStats.studyHours.change.toString(), 
            direction: "up", 
            label: studentStats.studyHours.period 
          }}
        />
      </div>
    </div>
  );
}
