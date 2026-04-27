"use client";

import React, { useState } from "react";
import { AdminStatCard, Card, SearchInput } from "@/components/ui";
import { 
    GraduationCap, 
    Users, 
    UserCheck, 
    BookOpen,
    Bell,
    MoveRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const stats = [
        {
            label: "Total Students",
            value: "308",
            icon: <GraduationCap />,
            progress: 65,
            subtext: [
                { label: "Male (61%)" },
                { label: "Female (39%)" }
            ]
        },
        {
            label: "Teachers",
            value: "308",
            icon: <Users />,
            progress: 65,
            subtext: [
                { label: "Male (61%)" },
                { label: "Female (39%)" }
            ]
        },
        {
            label: "Total Staff",
            value: "308",
            icon: <UserCheck />,
            progress: 65,
            subtext: [
                { label: "Male (61%)" },
                { label: "Female (39%)" }
            ]
        },
        {
            label: "Total Subjects",
            value: "308",
            icon: <BookOpen />,
            progress: 65,
            subtext: [
                { label: "Male (61%)" },
                { label: "Female (39%)" }
            ]
        }
    ];

    // Chart Data
    const attendanceData = [
        { month: "Jan", value: 82 },
        { month: "Feb", value: 88 },
        { month: "Mar", value: 92 },
        { month: "Apr", value: 85 },
        { month: "May", value: 72 },
        { month: "June", value: 78 },
        { month: "Jul", value: 84 },
        { month: "Aug", value: 75 },
        { month: "Sep", value: 32 },
        { month: "Oct", value: 38 },
        { month: "Nov", value: 88 },
        { month: "Dec", value: 96 }
    ];

    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; month: string } | null>(null);

    // SVG coordinates calculation
    const getX = (index: number) => 60 + (index * (900 / 11));
    const getY = (value: number) => 220 - (value - 20) * 2.25;

    // Generate Path D
    const points = attendanceData.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
    
    // Create a smooth cubic bezier path
    const generatePath = () => {
        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            const cp2y = p1.y;
            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
        }
        return d;
    };

    const pathD = generatePath();
    const areaD = `${pathD} L ${points[points.length - 1].x},220 L ${points[0].x},220 Z`;

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            </div>

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Welcome back Admin</h2>
                <div className="w-full md:w-96">
                    <SearchInput placeholder="Search..." />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <AdminStatCard
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        progress={stat.progress}
                        subtext={stat.subtext}
                        className="min-w-0" // Ensure they can shrink for same-row subtext
                    />
                ))}
            </div>

            {/* Attendance Summary Chart */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Attendance summary</h3>
                <Card className="p-8 pb-4 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden bg-white">
                    <div className="relative" style={{ height: 320 }}>
                        <svg
                            viewBox="0 0 1000 240"
                            preserveAspectRatio="none"
                            className="absolute inset-0 w-full h-full overflow-visible"
                        >
                            <defs>
                                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Y-Axis Grid Lines & Labels */}
                            {[100, 80, 60, 40, 20].map(val => {
                                const y = getY(val);
                                return (
                                    <g key={val}>
                                        <line
                                            x1="60" y1={y} x2="960" y2={y}
                                            stroke="#F1F5F9" strokeWidth="1"
                                        />
                                        <text
                                            x="50" y={y + 4}
                                            textAnchor="end"
                                            fontSize="12"
                                            fill="#94A3B8"
                                            className="font-medium"
                                        >{val}%</text>
                                    </g>
                                );
                            })}

                            {/* The Area Path */}
                            <path d={areaD} fill="url(#attendanceGradient)" />

                            {/* The Line Path */}
                            <path
                                d={pathD}
                                fill="none"
                                stroke="#000000"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Interactive Hover Areas */}
                            {attendanceData.map((d, i) => (
                                <g key={i} onMouseEnter={() => setHoveredPoint({ ...points[i], value: d.value, month: d.month })} onMouseLeave={() => setHoveredPoint(null)}>
                                    <rect
                                        x={getX(i) - 20}
                                        y={0}
                                        width={40}
                                        height={240}
                                        fill="transparent"
                                        className="cursor-pointer"
                                    />
                                    {/* Hover Indicator Dot */}
                                    {hoveredPoint?.month === d.month && (
                                        <circle cx={getX(i)} cy={getY(d.value)} r="6" fill="white" stroke="black" strokeWidth="3" />
                                    )}
                                </g>
                            ))}
                        </svg>

                        {/* Floating Tooltip */}
                        <AnimatePresence>
                            {hoveredPoint && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold pointer-events-none z-20 shadow-xl"
                                    style={{ 
                                        left: hoveredPoint.x, 
                                        top: hoveredPoint.y - 45,
                                        transform: "translateX(-50%)"
                                    }}
                                >
                                    {hoveredPoint.value}%
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-black" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-[60px]">
                            {attendanceData.map((d) => (
                                <span key={d.month} className="text-sm font-medium text-gray-400 w-12 text-center">
                                    {d.month}
                                </span>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bottom Sections Row */}
            <div className="space-y-12 pt-4">
                {/* Class Performance Overview */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Class Performance Overview</h3>
                    <div className="border border-gray-100 rounded-none overflow-hidden shadow-sm">
                        <table className="w-full text-center border-collapse">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="py-5 font-medium border-r border-white/10 w-1/3">Year one</th>
                                    <th className="py-5 font-medium border-r border-white/10 w-1/3">Year two</th>
                                    <th className="py-5 font-medium w-1/3">Year three</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#F8FAFC]">
                                <tr>
                                    <td className="py-8 text-xl font-bold text-gray-900">80%-90%</td>
                                    <td className="py-8 text-xl font-bold text-gray-900">80%-90%</td>
                                    <td className="py-8 text-xl font-bold text-gray-900">80%-90%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Upcoming events</h3>
                    <div className="flex items-center justify-between py-2 group">
                        <div className="flex items-center gap-4">
                            <Bell size={20} className="text-gray-900" />
                            <p className="text-[15px] font-medium text-gray-800 leading-none">
                                This saturday we have visitors from REB coming to visit our students on the use of AI
                            </p>
                        </div>
                        <button className="flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:gap-2.5 transition-all">
                            View details <MoveRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
