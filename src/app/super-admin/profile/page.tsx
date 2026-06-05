"use client";

import { Card } from "@/components/ui";
import { Mail } from "lucide-react";

export default function SuperAdminProfilePage() {
    return (
        <div className="space-y-6 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Personal Profile</h1>
                <p className="text-gray-500 mt-1">
                    Manage your personal information, account security, and notification preferences.
                </p>
            </div>

            <Card className="p-8 sm:p-10 border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            <img
                                src="https://i.pravatar.cc/150?u=alexarawles"
                                alt="Alexa Rawles"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-gray-900">Alexa Rawles</h2>
                            <p className="text-gray-500 mt-1">alexarawles@gmail.com</p>
                        </div>
                    </div>
                    <button className="bg-black text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors w-full md:w-auto">
                        Edit
                    </button>
                </div>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-12">
                    <div>
                        <p className="text-md text-black mb-2">First Name</p>
                        <p className="text-sm font-normal text-gray-500">John</p>
                    </div>
                    <div>
                        <p className="text-md text-black mb-2">Last Name</p>
                        <p className="text-sm font-normal text-gray-500">Doe</p>
                    </div>
                    <div>
                        <p className="text-md text-black mb-2">Gender</p>
                        <p className="text-sm font-normal text-gray-500">Female</p>
                    </div>
                    <div>
                        <p className="text-md text-black mb-2">Country</p>
                        <p className="text-sm font-normal text-gray-500">Rwanda</p>
                    </div>
                    <div>
                        <p className="text-md text-black mb-2">Phone number</p>
                        <p className="text-sm font-normal text-gray-500">0793131491</p>
                    </div>
                    <div>
                        <p className="text-md text-black mb-2">Role</p>
                        <p className="text-sm font-normal text-gray-500">Super Admin</p>
                    </div>
                </div>

                {/* Email Address Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">My email Address</h3>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Mail size={18} className="text-black" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">alexarawles@gmail.com</p>
                            <p className="text-xs text-gray-500 mt-0.5">1 month ago</p>
                        </div>
                    </div>

                    <button className="bg-blue-50 text-black px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
                        +Add Email Address
                    </button>
                </div>
            </Card>
        </div>
    );
}

