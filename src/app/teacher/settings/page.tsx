"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/queries";
import {
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  AlertCircle,
  Check,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  gradeNotifications: boolean;
  assignmentNotifications: boolean;
  attendanceNotifications: boolean;
  messageNotifications: boolean;
}

export default function TeacherSettingsPage() {
  const router = useRouter();
  const { data: user } = useMe();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    gradeNotifications: true,
    assignmentNotifications: true,
    attendanceNotifications: true,
    messageNotifications: true,
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () =>
      apiClient("/auth/logout", {
        method: "POST",
      }),
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
      router.push("/login");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: typeof passwordData) =>
      apiClient("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      setSuccess("Password changed successfully!");
      setError(null);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordChange(false);
      setShowPasswordFields(false);
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to change password");
      setSuccess(null);
    },
  });

  const handleSavePreferences = () => {
    setSuccess("Preferences saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleChangePassword = () => {
    setError(null);

    if (!passwordData.currentPassword.trim()) {
      setError("Current password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  return (
    <div className="pb-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-bold mb-2">Settings</h1>
        <p className="text-gray-500 font-medium text-sm sm:text-base">Manage your account preferences and security</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Bell size={24} className="text-gray-600" />
            <h2 className="text-lg sm:text-xl font-bold text-black">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-gray-50 last:border-0">
                <label className="text-sm sm:text-base text-gray-700 font-medium">
                  {key === "emailNotifications" && "Email Notifications"}
                  {key === "pushNotifications" && "Push Notifications"}
                  {key === "gradeNotifications" && "Grade Updates"}
                  {key === "assignmentNotifications" && "Assignment Reminders"}
                  {key === "attendanceNotifications" && "Attendance Records"}
                  {key === "messageNotifications" && "Message Alerts"}
                </label>
                <button
                  onClick={() => setPreferences({ ...preferences, [key]: !value })}
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0",
                    value ? "bg-black" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white transition-transform",
                      value ? "translate-x-7" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSavePreferences}
            className="mt-6 w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Save Preferences
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Lock size={24} className="text-gray-600" />
            <h2 className="text-lg sm:text-xl font-bold text-black">Password & Security</h2>
          </div>

          {!showPasswordChange ? (
            <button
              onClick={() => {
                setShowPasswordChange(true);
                setShowPasswordFields(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Change Password
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="space-y-4">
              {showPasswordFields && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {changePasswordMutation.isPending && <Loader size={18} className="animate-spin" />}
                      {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setShowPasswordFields(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setError(null);
                      }}
                      className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <LogOut size={24} className="text-gray-600" />
            <h2 className="text-lg sm:text-xl font-bold text-black">Account</h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">You're currently logged in as <span className="font-semibold">{user?.firstName} {user?.lastName}</span></p>

          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

