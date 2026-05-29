"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "@/lib/api/students";
import { Card, CardBody } from "@/components/ui";
import { User, Mail, Phone, Calendar, Hash, School, Loader2 } from "lucide-react";
import { toast } from "@/lib/utils/toast";

export default function StudentProfilePage() {
  const queryClient = useQueryClient();

  const { data: student, isLoading } = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentsApi.getMyProfile,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">View your student profile information</p>
      </div>

      {/* Profile Header Card */}
      <Card className="border-none shadow-sm">
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {student.user.avatarUrl ? (
                <img
                  src={student.user.avatarUrl}
                  alt={`${student.user.firstName} ${student.user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center border-4 border-gray-100">
                  <span className="text-white text-4xl font-bold">
                    {student.user.firstName.charAt(0)}{student.user.lastName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {student.user.firstName} {student.user.lastName}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Hash size={16} />
                  <span className="font-medium">{student.studentNumber}</span>
                </div>
                {student.class && (
                  <div className="flex items-center gap-2">
                    <School size={16} />
                    <span className="font-medium">{student.class.name}</span>
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  student.isActive 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {student.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Personal Information */}
      <Card className="border-none shadow-sm">
        <CardBody className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <User size={16} />
                First Name
              </label>
              <div className="text-lg font-medium text-gray-900">
                {student.user.firstName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <User size={16} />
                Last Name
              </label>
              <div className="text-lg font-medium text-gray-900">
                {student.user.lastName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Mail size={16} />
                Email Address
              </label>
              <div className="text-lg font-medium text-gray-900">
                {student.user.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Phone size={16} />
                Phone Number
              </label>
              <div className="text-lg font-medium text-gray-900">
                {student.user.phoneNumber || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Calendar size={16} />
                Date of Birth
              </label>
              <div className="text-lg font-medium text-gray-900">
                {formatDate(student.dateOfBirth)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <User size={16} />
                Gender
              </label>
              <div className="text-lg font-medium text-gray-900">
                {student.gender || "Not specified"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Calendar size={16} />
                Enrollment Date
              </label>
              <div className="text-lg font-medium text-gray-900">
                {formatDate(student.enrollmentDate || null)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Hash size={16} />
                Student Number
              </label>
              <div className="text-lg font-medium text-gray-900">
                {student.studentNumber}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Academic Information */}
      {student.class && (
        <Card className="border-none shadow-sm">
          <CardBody className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Academic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <School size={16} />
                  Class
                </label>
                <div className="text-lg font-medium text-gray-900">
                  {student.class.name}
                </div>
              </div>

              {student.class.year && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    <Calendar size={16} />
                    Year
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    Year {student.class.year}
                  </div>
                </div>
              )}

              {student.class.stream && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                    <School size={16} />
                    Stream
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {student.class.stream}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> To update your profile information, please contact your school administrator.
        </p>
      </div>
    </div>
  );
}