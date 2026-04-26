"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { Edit, Mail, Plus } from "lucide-react";

export default function AccountantProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personal Profile</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardBody className="p-6">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src="/api/placeholder/80/80" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Alexa Rawles</h2>
                <p className="text-gray-600">alexarawles@gmail.com</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Edit
            </button>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                John
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                Doe
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                Female
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                Rwanda
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone number
              </label>
              <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                0793131491
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                Super Admin
              </div>
            </div>
          </div>

          {/* Email Address Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">My email Address</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">alexarawles@gmail.com</div>
                <div className="text-sm text-gray-500">1 month ago</div>
              </div>
            </div>

            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus size={16} />
              Add Email Address
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}