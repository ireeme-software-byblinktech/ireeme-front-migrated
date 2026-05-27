"use client";

import React from "react";
import { Card, CardBody } from "@/components/ui";
import { Mail, Phone, MapPin, Shield, School, User as UserIcon } from "lucide-react";

export default function AdminProfilePage() {
    const profileInfo = [
        { label: "Full Name", value: "John Doe", icon: <UserIcon size={18} /> },
        { label: "School Name", value: "RCA", icon: <School size={18} /> },
        { label: "Gender", value: "Female", icon: <UserIcon size={18} /> }, // Matches screenshot value "Female"
        { label: "Country", value: "Rwanda", icon: <MapPin size={18} /> },
        { label: "Phone number", value: "0793131491", icon: <Phone size={18} /> },
        { label: "Role", value: "School Admin", icon: <Shield size={18} /> },
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.05)] overflow-hidden rounded-[24px]">
                <CardBody className="p-10 space-y-12">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img 
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop" 
                                        alt="Alexa Rawles" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alexa Rawles</h1>
                                <p className="text-gray-400 font-medium text-sm">alexarawles@gmail.com</p>
                            </div>
                        </div>
                        <button className="bg-black text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md">
                            Edit
                        </button>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                        {profileInfo.map((item, index) => (
                            <div key={index} className="space-y-3 group">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block">
                                    {item.label}
                                </label>
                                <div className="text-[17px] font-semibold text-gray-600 transition-colors group-hover:text-black">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Email Section */}
                    <div className="pt-6 space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">My email Address</h3>
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm border border-gray-100">
                                <Mail size={22} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-base font-bold text-gray-900">alexarawles@gmail.com</p>
                                <p className="text-xs text-gray-400 font-medium">1 month ago</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
