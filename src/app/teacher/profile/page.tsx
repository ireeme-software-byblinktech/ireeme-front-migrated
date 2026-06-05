"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { User, Mail, Phone, Briefcase, Edit2, Save, X, AlertCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeacherDetails {
  id: string;
  employeeNum: string;
  department?: string | null;
  qualification?: string | null;
  joiningDate: string;
}

export default function TeacherProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user profile - REAL DATA
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      console.log('[PROFILE PAGE] Fetching user profile...');
      const response = await apiClient<UserProfile>("/users/profile");
      console.log('[PROFILE PAGE] User profile response:', response);
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch teacher details - REAL DATA
  const { data: teacherDetails, isLoading: teacherLoading } = useQuery({
    queryKey: ["teacher-details"],
    queryFn: async () => {
      console.log('[PROFILE PAGE] Fetching teacher details...');
      const response = await apiClient<TeacherDetails>("/teachers/details");
      console.log('[PROFILE PAGE] Teacher details response:', response);
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update form when user profile loads
  useEffect(() => {
    if (userProfile) {
      console.log('[PROFILE PAGE] Setting form data from profile:', userProfile);
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phoneNumber: userProfile.phoneNumber || "",
      });
    }
  }, [userProfile]);

  // Update profile mutation - REAL DB SAVE
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phoneNumber?: string }) => {
      console.log('[UPDATE PROFILE] Sending update request with:', data);
      const response = await apiClient<UserProfile>("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      console.log('[UPDATE PROFILE] Response from server:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('[UPDATE PROFILE] Success! Updated data:', data);
      setSuccess("Profile updated successfully!");
      setError(null);
      setIsEditing(false);
      
      // Refetch both queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["user-profile"], refetchType: "all" });
      refetchProfile();
      
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error: any) => {
      console.error('[UPDATE PROFILE] Error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update profile";
      setError(errorMessage);
      setSuccess(null);
    },
  });

  const handleSaveProfile = async () => {
    console.log('[SAVE PROFILE] Starting save with:', formData);
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    await updateProfileMutation.mutateAsync({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber?.trim() || undefined,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phoneNumber: userProfile.phoneNumber || "",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state
  if (profileLoading || teacherLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-black" size={40} />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if profile failed to load
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">Failed to load profile. Please refresh the page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your profile information</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="w-5 h-5 bg-green-600 rounded-full mt-0.5 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-700 text-sm mt-1">{success}</p>
            </div>
          </div>
        )}

        {/* Main Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Avatar Section */}
          <div className="h-32 bg-gradient-to-r from-black to-gray-800 relative">
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center text-5xl font-bold text-white border-4 border-white shadow-lg">
                {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-24 px-8 pb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{userProfile?.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={updateProfileMutation.isPending}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                  isEditing
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-900"
                )}
              >
                {isEditing ? (
                  <>
                    <X size={18} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 size={18} />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className={cn("w-3 h-3 rounded-full", userProfile?.isActive ? "bg-green-500" : "bg-gray-400")} />
              <span className={cn("text-sm font-medium", userProfile?.isActive ? "text-green-700" : "text-gray-600")}>
                {userProfile?.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Edit Form */}
            {isEditing ? (
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userProfile?.email || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    placeholder="Phone number (optional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Display Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="font-medium text-gray-900">{userProfile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="font-medium text-gray-900">{userProfile?.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                      <p className="font-medium text-gray-900">Teacher</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="text-gray-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                      <p className="font-medium text-gray-900">{userProfile?.isActive ? "Active" : "Inactive"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Details Section - REAL DATA FROM DB */}
        {teacherDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Professional Details</h3>
              <p className="text-gray-500 text-sm mt-1">Information from the database</p>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Employee Number</p>
                <p className="text-lg font-semibold text-gray-900">{teacherDetails.employeeNum || "N/A"}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Department</p>
                <p className="text-lg font-semibold text-gray-900">{teacherDetails.department || "Not assigned"}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Qualification</p>
                <p className="text-lg font-semibold text-gray-900">{teacherDetails.qualification || "Not specified"}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Joining Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(teacherDetails.joiningDate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

