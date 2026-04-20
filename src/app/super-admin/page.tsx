"use client";

import { useState } from "react";
import { StatCard, Card } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { SearchInput, Select } from "@/components/ui/FormElements";
import {
    Users,
    School,
    UserCheck,
    GraduationCap,
    ChevronDown,
    Edit,
    ToggleRight,
    ToggleLeft
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for the table
const schoolData = [
    ...Array.from({ length: 25 }).map((_, i) => ({
        id: `school-${i + 1}`,
        name: "Rwanda Coding Academy",
        code: "12090857063",
        dateJoined: "12-06-2025",
        totalStudents: 800,
        totalStaff: 800,
        status: "Active" as "Active" | "Inactive"
    }))
];

const activityData = [
    3, 1, 2, 0, 3, 2, 1,
    2, 3, 1, 0, 2, 3, 1,
    0, 2, 3, 1, 2, 0, 3,
    1, 3, 2, 0, 1, 2, 3,
];

export default function SuperAdminDashboard() {
    const [selectedMonth, setSelectedMonth] = useState("October");
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const columns: Column<any>[] = [
        {
            key: "select",
            header: "☐",
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
        },
        {
            key: "name",
            header: "School Name",
            render: (v: any) => <span className="font-semibold text-gray-900">{v}</span>
        },
        {
            key: "code",
            header: "School Code",
            render: (v: any) => <span className="text-gray-600">{v}</span>
        },
        {
            key: "dateJoined",
            header: "Date Joined",
            render: (v: any) => <span className="text-gray-600">{v}</span>
        },
        {
            key: "totalStudents",
            header: "Total students",
            render: (v: any) => <span className="font-bold text-gray-900">{v}</span>
        },
        {
            key: "totalStaff",
            header: "Total Staff",
            render: (v: any) => <span className="font-bold text-gray-900">{v}</span>
        },
        {
            key: "action",
            header: "Action",
            align: "center",
            render: () => (
                <div className="flex items-center gap-3 justify-center">
                    <button className="text-gray-400 hover:text-black transition-colors">
                        <Edit size={18} />
                    </button>
                    <button className="text-black">
                        <ToggleRight size={24} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Schools"
                    value="308"
                    icon={<School size={24} />}
                    progress={65}
                    trend={{ value: "0.5%", direction: "up", label: "Present today" }}
                />
                <StatCard
                    label="Total Teachers"
                    value="308"
                    icon={<Users size={24} />}
                    progress={45}
                    meta={{ male: "61%", female: "39%" }}
                />
                <StatCard
                    label="Total Accountants"
                    value="308"
                    icon={<UserCheck size={24} />}
                    progress={30}
                    meta={{ male: "61%", female: "39%" }}
                />
                <StatCard
                    label="Total Students"
                    value="308"
                    icon={<GraduationCap size={24} />}
                    progress={80}
                    meta={{ male: "61%", female: "39%" }}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Schools Line Chart */}
                <Card className="lg:col-span-2 p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden bg-white">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[20px] font-bold text-gray-950">Active Schools</h3>
                    </div>

                    <div className="relative" style={{ height: 280 }}>
                        <svg
                            viewBox="0 0 900 220"
                            preserveAspectRatio="none"
                            className="absolute inset-0 w-full h-full overflow-visible"
                        >
                            <defs>
                                {/* Black gradient for filled area */}
                                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#000000" stopOpacity="0.09" />
                                    <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                                </linearGradient>
                                {/* Slightly lighter for outer LDK background */}
                                <linearGradient id="areaFill2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#000000" stopOpacity="0.05" />
                                    <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Y-Axis Grid Lines & Labels — 0% to 100% */}
                            {([0, 25, 50, 75, 100] as const).map(val => {
                                const y = 200 - val * 1.85;
                                return (
                                    <g key={val}>
                                        <line
                                            x1="60" y1={y} x2="900" y2={y}
                                            stroke="#E5E7EB" strokeWidth="1"
                                        />
                                        <text
                                            x="50" y={y + 4}
                                            textAnchor="end"
                                            fontSize="12"
                                            fill="#9CA3AF"
                                            fontWeight="500"
                                            className="font-medium"
                                        >{val}%</text>
                                    </g>
                                );
                            })}

                            <path
                                d={`
                                  M 60,160
                                  C 108,170 168,140 210,130
                                  C 252,120 310,160 360,150
                                  C 400,140 460,100 510,110
                                  C 560,120 605,70 660,80
                                  C 712,90 760,150 810,160
                                  L 900,150 L 900,200 L 60,200 Z
                                `}
                                fill="url(#areaFill2)"
                            />

                            <path
                                d={`
                                  M 60,71
                                  C 108,52 168,43 210,43
                                  C 252,43 310,90 360,90
                                  C 400,90 460,60 510,65
                                  C 560,70 605,196 660,194
                                  C 712,192 760,20 810,34
                                  L 900,31 L 900,200 L 60,200 Z
                                `}
                                fill="url(#areaFill)"
                            />

                            <path
                                d={`
                                  M 60,160
                                  C 108,170 168,140 210,130
                                  C 252,120 310,160 360,150
                                  C 400,140 460,100 510,110
                                  C 560,120 605,70 660,80
                                  C 712,90 760,150 810,160
                                  L 900,150
                                `}
                                fill="none"
                                stroke="#111827"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d={`
                                  M 60,71
                                  C 108,52 168,43 210,43
                                  C 252,43 310,90 360,90
                                  C 400,90 460,60 510,65
                                  C 560,70 605,196 660,194
                                  C 712,192 760,20 810,34
                                  L 900,31
                                `}
                                fill="none"
                                stroke="#000000"
                                strokeWidth="2.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <g transform="translate(510, 65)">
                                <circle r="4.5" fill="white" stroke="#000000" strokeWidth="2.2" />
                                <line x1="0" y1="-5" x2="0" y2="-20" stroke="#000000" strokeWidth="1.5" />
                                <rect x="-20" y="-46" width="44" height="24" rx="5" fill="#111827" />
                                <text x="2" y="-29" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">RCA</text>
                            </g>

                            <g transform="translate(660, 80)">
                                <circle r="4" fill="white" stroke="#111827" strokeWidth="2" />
                                <line x1="0" y1="-5" x2="0" y2="-20" stroke="#111827" strokeWidth="1.5" />
                                <rect x="-20" y="-46" width="44" height="24" rx="5" fill="#111827" />
                                <text x="2" y="-29" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">LDK</text>
                            </g>
                        </svg>

                        {/* X-axis day labels — positioned below chart */}
                        <div
                            className="absolute bottom-0 left-0 right-0 flex items-center"
                            style={{ paddingLeft: 60, paddingRight: 0 }}
                        >
                            {['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'].map((day, idx) => (
                                <span
                                    key={day}
                                    className="text-[14px] font-medium text-gray-400"
                                    style={{ flex: 1, textAlign: idx === 0 ? 'left' : 'center' }}
                                >{day}</span>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* System Activity Heatmap */}
                <Card className="p-8 rounded-[32px] border border-gray-50 shadow-sm overflow-visible">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-[20px] font-bold text-gray-950 leading-tight">System Activity</h3>
                            <p className="text-md text-gray-400 mt-2 font-medium">Daily platform usage</p>
                        </div>
                        <div className="relative">
                            <button
                                className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-[13px] font-bold text-gray-900 hover:bg-white hover:border-gray-200 transition-all shadow-sm"
                                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                            >
                                {selectedMonth} <ChevronDown size={14} className={`transition-transform duration-300 ${isMonthDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isMonthDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in zoom-in duration-200">
                                    {months.map(month => (
                                        <button
                                            key={month}
                                            className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${selectedMonth === month ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                            onClick={() => {
                                                setSelectedMonth(month);
                                                setIsMonthDropdownOpen(false);
                                            }}
                                        >
                                            {month}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-3 mb-10">
                        {activityData.map((level, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-lg relative group transition-all duration-300 transform hover:scale-110 cursor-pointer ${level === 0 ? "bg-gray-100" :
                                    level === 1 ? "bg-gray-300" :
                                        level === 2 ? "bg-gray-500" :
                                            "bg-black"
                                    }`}
                            >
                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-24 bg-black text-white p-2.5 rounded-md text-[10px] font-medium leading-tight invisible group-hover:visible shadow-2xl z-[60] text-center">
                                    308 logins on Oct {i + 1}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-black"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <span className="text-[14px] font-medium text-gray-400">Activity Level</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-100"></div>
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-300"></div>
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-gray-500"></div>
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-black"></div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Schools Overview Table */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Schools overview</h2>
                    <div className="w-[180px]">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none w-full">
                            <select className="bg-transparent border-none outline-none text-sm font-semibold text-gray-700 w-full appearance-none cursor-pointer">
                                <option>status</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <Card className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <DataTable
                        columns={columns}
                        data={schoolData}
                        pageSize={10}
                        className="school-table border-0"
                        paginationClassName="pagination-rounded p-6"
                    />
                </Card>
            </div>
        </div>
    );
}
