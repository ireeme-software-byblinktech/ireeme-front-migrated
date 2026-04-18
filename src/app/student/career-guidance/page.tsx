"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatCard } from "@/components/ui/Card";
import { GraduationCap, BookOpen, FileText, BarChart2, ExternalLink } from "lucide-react";

// Stats data array
const statsData = [
  {
    label: "Total Subjects",
    value: 15,
    icon: <GraduationCap size={18} />,
    progress: 75,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Assignments", 
    value: 30,
    icon: <BookOpen size={18} />,
    progress: 80,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Notes",
    value: 30, 
    icon: <FileText size={18} />,
    progress: 65,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total reports",
    value: 30,
    icon: <BarChart2 size={18} />,
    progress: 90,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

// Career data interface
interface Career {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSubjects: string[];
  minGrade: string;
  jobMarket: string;
  expectedSalary: string;
  icon: string;
}

// Sample career data
const careersData: Career[] = [
  {
    id: "1",
    title: "Software Engineer",
    description: "Design, develop, and maintain software applications and systems.",
    category: "Technology",
    requiredSubjects: ["Mathematics", "Computer Science", "Physics"],
    minGrade: "B+ or higher",
    jobMarket: "Excellent",
    expectedSalary: "$80,000 - $150,000/year",
    icon: "💻"
  },
  {
    id: "2",
    title: "Medical Doctor",
    description: "Diagnose and treat illnesses, injuries, and medical conditions.",
    category: "Healthcare",
    requiredSubjects: ["Biology", "Chemistry", "Physics", "Mathematics"],
    minGrade: "A- or higher",
    jobMarket: "Excellent",
    expectedSalary: "$150,000 - $300,000/year",
    icon: "🏥"
  },
  {
    id: "3",
    title: "Civil Engineer",
    description: "Design and oversee construction of infrastructure projects.",
    category: "Engineering",
    requiredSubjects: ["Mathematics", "Physics", "Technical Drawing"],
    minGrade: "B or higher",
    jobMarket: "Very Good",
    expectedSalary: "$70,000 - $120,000/year",
    icon: "🏗️"
  },
  {
    id: "4",
    title: "Financial Analyst",
    description: "Analyze financial data and provide investment recommendations.",
    category: "Business",
    requiredSubjects: ["Mathematics", "Economics", "Business Studies"],
    minGrade: "B+ or higher",
    jobMarket: "Good",
    expectedSalary: "$65,000 - $110,000/year",
    icon: "📊"
  },
  {
    id: "5",
    title: "Graphic Designer",
    description: "Create visual concepts to communicate ideas and inspire audiences.",
    category: "Creative Arts",
    requiredSubjects: ["Art", "Computer Science", "Design"],
    minGrade: "B or higher",
    jobMarket: "Good",
    expectedSalary: "$45,000 - $85,000/year",
    icon: "🎨"
  },
  {
    id: "6",
    title: "Civil Engineer",
    description: "Design and oversee construction of infrastructure projects.",
    category: "Engineering",
    requiredSubjects: ["Mathematics", "Physics", "Technical Drawing"],
    minGrade: "B or higher",
    jobMarket: "Very Good",
    expectedSalary: "$70,000 - $120,000/year",
    icon: "🏗️"
  }
];

export default function CareerGuidancePage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<"Paths" | "Counselors" | "Workshops" | "Resources">("Paths");
  const [activeCareerTab, setActiveCareerTab] = useState<"All" | "Technology" | "Healthcare" | "Engineering" | "Business" | "Creative Arts">("All");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter careers based on active tab
  const filteredCareers = careersData.filter(career => 
    activeCareerTab === "All" || career.category === activeCareerTab
  );

  const getJobMarketColor = (market: string) => {
    switch (market) {
      case "Excellent":
        return "text-green-600 bg-green-100";
      case "Very Good":
        return "text-green-600 bg-green-100";
      case "Good":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Career Guidance</h1>
        <p className="text-gray-600 mt-1">Explore career paths, connect with counselors, and prepare for your future</p>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value.toString()}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
            onClick={() => {
              if (stat.label === "Total Assignments") router.push("/student/assignments");
              else if (stat.label === "Total Notes") router.push("/student/notes");
              else if (stat.label.toLowerCase() === "total reports") router.push("/student/report-card");
              else if (stat.label === "Total Subjects") router.push("/student/timetable");
            }}
          />
        ))}
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        {(["Paths", "Counselors", "Workshops", "Resources"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveMainTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeMainTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Career Categories (only show for Paths tab) */}
      {activeMainTab === "Paths" && (
        <div className="flex gap-2 flex-wrap">
          {(["All", "Technology", "Healthcare", "Engineering", "Business", "Creative Arts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCareerTab(tab)}
              className={`px-6 py-3 text-sm font-medium rounded transition-colors ${
                activeCareerTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{ borderRadius: '6px' }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Career Cards Grid */}
      {activeMainTab === "Paths" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <div key={career.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Career Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white text-xl">
                  {career.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">{career.category}</div>
                  <h3 className="font-semibold text-gray-900 text-lg">{career.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{career.description}</p>

              {/* Required Subjects */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase">Required Subjects</h4>
                <div className="flex flex-wrap gap-1">
                  {career.requiredSubjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grade and Job Market */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Min. Grade</div>
                  <div className="font-medium text-sm">{career.minGrade}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Job Market</div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getJobMarketColor(career.jobMarket)}`}>
                    {career.jobMarket}
                  </span>
                </div>
              </div>

              {/* Expected Salary */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Expected Salary</div>
                <div className="font-semibold text-sm text-gray-900">{career.expectedSalary}</div>
              </div>

              {/* Learn More Button */}
              <button 
                onClick={() => {
                  setSelectedCareer(career);
                  setIsModalOpen(true);
                }}
                className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Learn More
                <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Content for other tabs */}
      {activeMainTab === "Counselors" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Dr. Sarah Johnson",
                title: "Career Counselor",
                specialization: "STEM Careers",
                experience: "8 years",
                rating: 4.9,
                availability: "Available",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Prof. Michael Chen",
                title: "Academic Advisor",
                specialization: "Business & Finance",
                experience: "12 years",
                rating: 4.8,
                availability: "Busy",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              },
              {
                name: "Ms. Emily Rodriguez",
                title: "Career Coach",
                specialization: "Creative Arts",
                experience: "6 years",
                rating: 4.7,
                availability: "Available",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
              }
            ].map((counselor, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={counselor.image} 
                    alt={counselor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{counselor.name}</h3>
                    <p className="text-sm text-gray-600">{counselor.title}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Specialization:</span>
                    <span className="font-medium">{counselor.specialization}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Experience:</span>
                    <span className="font-medium">{counselor.experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rating:</span>
                    <span className="font-medium">⭐ {counselor.rating}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      counselor.availability === "Available" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {counselor.availability}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMainTab === "Workshops" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Resume Writing Workshop",
                date: "March 15, 2025",
                time: "2:00 PM - 4:00 PM",
                instructor: "Dr. Sarah Johnson",
                participants: 24,
                maxParticipants: 30,
                status: "Open",
                description: "Learn how to create compelling resumes that stand out to employers."
              },
              {
                title: "Interview Skills Masterclass",
                date: "March 22, 2025",
                time: "10:00 AM - 12:00 PM",
                instructor: "Prof. Michael Chen",
                participants: 18,
                maxParticipants: 25,
                status: "Open",
                description: "Master the art of job interviews with practical tips and mock sessions."
              },
              {
                title: "LinkedIn Profile Optimization",
                date: "March 29, 2025",
                time: "3:00 PM - 5:00 PM",
                instructor: "Ms. Emily Rodriguez",
                participants: 30,
                maxParticipants: 30,
                status: "Full",
                description: "Optimize your LinkedIn profile to attract recruiters and opportunities."
              },
              {
                title: "Networking Strategies",
                date: "April 5, 2025",
                time: "1:00 PM - 3:00 PM",
                instructor: "Dr. Sarah Johnson",
                participants: 12,
                maxParticipants: 20,
                status: "Open",
                description: "Build meaningful professional relationships and expand your network."
              }
            ].map((workshop, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{workshop.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    workshop.status === "Open" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {workshop.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{workshop.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{workshop.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">{workshop.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Instructor:</span>
                    <span className="font-medium">{workshop.instructor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Participants:</span>
                    <span className="font-medium">{workshop.participants}/{workshop.maxParticipants}</span>
                  </div>
                </div>
                <button 
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    workshop.status === "Open"
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={workshop.status === "Full"}
                >
                  {workshop.status === "Open" ? "Register Now" : "Workshop Full"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMainTab === "Resources" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Career Assessment Tools",
                description: "Discover your strengths and ideal career matches",
                type: "Assessment",
                items: ["Personality Test", "Skills Assessment", "Interest Inventory"],
                icon: "📊"
              },
              {
                title: "Industry Reports",
                description: "Latest trends and insights across different industries",
                type: "Reports",
                items: ["Tech Industry 2025", "Healthcare Outlook", "Finance Trends"],
                icon: "📈"
              },
              {
                title: "Interview Guides",
                description: "Comprehensive guides for different types of interviews",
                type: "Guides",
                items: ["Technical Interviews", "Behavioral Questions", "Case Studies"],
                icon: "📝"
              },
              {
                title: "Salary Benchmarks",
                description: "Current salary ranges for various positions",
                type: "Data",
                items: ["Entry Level Salaries", "Mid-Career Ranges", "Executive Compensation"],
                icon: "💰"
              },
              {
                title: "Skill Development",
                description: "Resources to build in-demand skills",
                type: "Learning",
                items: ["Online Courses", "Certification Programs", "Skill Assessments"],
                icon: "🎓"
              },
              {
                title: "Job Search Tools",
                description: "Tools and templates for effective job searching",
                type: "Tools",
                items: ["Resume Templates", "Cover Letter Samples", "Job Boards"],
                icon: "🔍"
              }
            ].map((resource, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white text-xl">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                      {resource.type}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <div className="space-y-2 mb-4">
                  {resource.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Access Resources
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Detail Modal */}
      {isModalOpen && selectedCareer && (
        <CareerDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          career={selectedCareer}
        />
      )}
    </div>
  );
}

// Career Detail Modal Component
function CareerDetailModal({ 
  isOpen, 
  onClose, 
  career 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  career: Career;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
            <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">Career Path: {career.title}</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg">
                  {career.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">{career.category}</div>
                  <h3 className="text-2xl font-bold text-gray-900">{career.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-500 font-bold uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed text-base">{career.description}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-500 font-bold uppercase tracking-wider mb-2">Required Subjects</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {career.requiredSubjects.map((subject, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
                  <div>
                    <div className="text-gray-500 font-bold mb-1">Minimum Grade Requirement</div>
                    <div className="text-lg font-extrabold text-gray-900">{career.minGrade}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 font-bold mb-1">Job Market Outlook</div>
                    <div className="inline-flex px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                      {career.jobMarket}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 font-bold mb-1">Expected Annual Salary</div>
                    <div className="text-xl font-extrabold text-[#000]">{career.expectedSalary}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 flex items-center justify-center">
                <button
                  onClick={onClose}
                  className="bg-black text-white px-10 py-3 rounded-xl text-base font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}