"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/queries";
import {
  Settings,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Toggle2,
  Eye,
  EyeOff,
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
      apiClient("/api/v1/auth/logout", {
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
      apiClient("/api/v1/auth/change-password", {
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

    if (!passwordData.newPassword.trim()) {
      setError("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-black rounded-lg">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your preferences and account</p>
            </div>
          </div>
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
            <Check className="text-green-600 mt-0.5 shrink-0" size={18} />
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-700 text-sm mt-1">{success}</p>
            </div>
          </div>
        )}

        {/* Notification Preferences Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-3">
            <Bell className="text-gray-600" size={22} />
            <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {[
              { id: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
              { id: "pushNotifications", label: "Push Notifications", description: "Receive push notifications in the app" },
              {
                id: "gradeNotifications",
                label: "Grade Notifications",
                description: "Get notified when grades are posted",
              },
              {
                id: "assignmentNotifications",
                label: "Assignment Notifications",
                description: "Get notified about new assignments",
              },
              {
                id: "attendanceNotifications",
                label: "Attendance Notifications",
                description: "Get notified about attendance updates",
              },
              { id: "messageNotifications", label: "Message Notifications", description: "Get notified about new messages" },
            ].map((setting) => (
              <div key={setting.id} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">{setting.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
                <button
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      [setting.id]: !preferences[setting.id as keyof NotificationPreferences],
                    })
                  }
                  className={cn(
                    "relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none",
                    preferences[setting.id as keyof NotificationPreferences]
                      ? "bg-black"
                      : "bg-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 flex items-center justify-center",
                      preferences[setting.id as keyof NotificationPreferences] && "translate-x-6"
                    )}
                  >
                    {preferences[setting.id as keyof NotificationPreferences] ? (
                      <Check size={14} className="text-black" />
                    ) : null}
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className="px-8 py-4 bg-gray-50 flex gap-3">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-3">
            <Lock className="text-gray-600" size={22} />
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          </div>

          {showPasswordChange ? (
            <div className="px-8 py-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type={showPasswordFields ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type={showPasswordFields ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    placeholder="Enter new password (min. 8 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type={showPasswordFields ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {showPasswordFields ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPasswordFields ? "Hide" : "Show"} password
                </button>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordChange(false);
                      setShowPasswordFields(false);
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              <div className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
                </div>
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mt-1">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                  Coming Soon
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account</h2>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="px-8 py-4">
              <h3 className="font-medium text-gray-900">Email Address</h3>
              <p className="text-sm text-gray-600 mt-2 font-mono">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-3">Your email address is used to log in. Contact support to change it.</p>
            </div>

            <div className="px-8 py-4">
              <h3 className="font-medium text-gray-900 mb-4">Danger Zone</h3>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={18} />
                    Logout
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-3">You will be logged out of all sessions.</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Need help?</strong> Contact your school administrator or support team for additional assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
