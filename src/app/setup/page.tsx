"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CloudUpload,
  Check,
  BookOpen,
  LayoutGrid,
  ShieldCheck,
  Users,
  GraduationCap
} from "lucide-react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { cn } from "@/lib/utils";
import { apiClient, API_BASE_URL } from "@/lib/api/client";

const STEPS = [
  { id: 1, name: "Academic Year" },
  { id: 2, name: "Profile" },
  { id: 3, name: "Structure" },
  { id: 4, name: "Fees" },
  { id: 5, name: "Invite" },
  { id: 6, name: "Role" },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [academicYear, setAcademicYear] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [profile, setProfile] = useState({
    logoUrl: "",
    website: "",
    phone: "",
  });

  const [structure, setStructure] = useState<"term" | "continuous">("term");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBulk, setUploadingBulk] = useState(false);

  const nextStep = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/v1/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Logo upload failed");

      const data = await response.json();
      setProfile(prev => ({ ...prev, logoUrl: data.url }));
      console.log("Logo uploaded successfully:", data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBulk(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/v1/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Bulk upload failed");

      const data = await response.json();
      console.log("Bulk file uploaded:", data.url);
      alert("Staff list uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload bulk file");
    } finally {
      setUploadingBulk(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Create Academic Term/Year
      if (academicYear.name) {
        await apiClient("/academic-terms", {
          method: "POST",
          body: JSON.stringify({
            name: academicYear.name,
            startDate: new Date(academicYear.startDate).toISOString(),
            endDate: new Date(academicYear.endDate).toISOString(),
            isActive: true,
          }),
        });
      }

      // 2. Here you would normally update the school profile with the logoUrl, etc.
      // Since the endpoint might be missing, we at least ensure the flows above worked.

      router.push("/setup/success");
    } catch (err: any) {
      console.error("Setup completion error:", err);
      setError(err.message || "Failed to complete setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/20 font-sans py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-[800px]">

        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-[32px] font-bold tracking-tight text-black mb-2">Welcome to Blink Campus</h1>
          <p className="text-gray-500 text-lg font-medium">Let's get your institution ready for success.</p>
        </div>

        {/* Progress Stepper */}
        <div className="relative mb-20 px-4">
          <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-100 -z-10">
            <div
              className="h-full bg-black transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="flex justify-between">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  step === s.id ? "bg-black text-white scale-110 shadow-lg shadow-black/10" :
                    step > s.id ? "bg-black text-white" : "bg-white border-2 border-gray-100 text-gray-300"
                )}>
                  {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                  step === s.id ? "text-black" : "text-gray-300"
                )}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-black/[0.03] p-10 md:p-14 min-h-[440px] flex flex-col">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-2">Define Academic Year</h2>
                <p className="text-gray-500 font-medium">When does your institution's year start and end?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Year Name</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024-2025"
                    value={academicYear.name}
                    onChange={(e) => setAcademicYear(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={academicYear.startDate}
                      onChange={(e) => setAcademicYear(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full h-14 px-4 pr-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={academicYear.endDate}
                      onChange={(e) => setAcademicYear(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full h-14 px-4 pr-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-2">Institution Profile</h2>
                <p className="text-gray-500 font-medium">Add some branding to your workspace.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Institution Logo</label>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={logoInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {uploadingLogo ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : profile.logoUrl ? (
                        <Check className="w-6 h-6 text-green-500" />
                      ) : (
                        <CloudUpload className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-black mb-1">
                        {uploadingLogo ? "Uploading..." : profile.logoUrl ? "Logo Selected" : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-400 font-medium font-sans">PNG, JPG, SVG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Official Website</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                  />
                </div>

                <div className="space-y-2 relative" id="international-phone-container">
                  <label className="text-sm font-bold text-gray-700 ml-1">Contact Phone</label>
                  <PhoneInput
                    defaultCountry="rw"
                    value={profile.phone}
                    onChange={(phone) => setProfile(prev => ({ ...prev, phone }))}
                    className="w-full h-14"
                    inputClassName="!flex-1 !h-14 !w-full !rounded-r-xl !border-gray-300 !bg-gray-50 focus:!bg-white focus:!ring-inset focus:!ring-2 focus:!ring-black/5 focus:!border-black !transition-shadow !outline-none !text-base !border-l-0 !pl-3"
                    countrySelectorStyleProps={{
                      buttonClassName: "!h-14 !px-4 !bg-gray-50 !border !border-gray-300 !rounded-l-xl hover:!bg-gray-100 !transition-colors !border-r-0",
                      dropdownStyleProps: {
                        className: "!bg-white !rounded-2xl !shadow-2xl !border-gray-100 !p-2 !mt-2",
                        listItemClassName: "!rounded-lg hover:!bg-gray-50 !px-3 !py-2.5"
                      }
                    }}
                  />
                  <style jsx global>{`
                    #international-phone-container .react-international-phone-input-container {
                      display: flex !important;
                      width: 100% !important;
                    }
                    /* Remove the rounded corners where they meet */
                    #international-phone-container .react-international-phone-country-selector-button {
                      border-top-right-radius: 0 !important;
                      border-bottom-right-radius: 0 !important;
                      margin-right: 0 !important;
                    }
                    #international-phone-container .react-international-phone-input {
                      border-top-left-radius: 0 !important;
                      border-bottom-left-radius: 0 !important;
                      margin-left: 0 !important;
                    }
                  `}</style>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-2">Academic Structure</h2>
                <p className="text-gray-500 font-medium">How are your classes or programs organized?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setStructure("term")}
                  className={cn(
                    "relative p-8 rounded-[24px] border-2 text-left transition-all duration-300 group",
                    structure === "term" ? "border-black bg-white shadow-xl shadow-black/[0.03]" : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors",
                    structure === "term" ? "bg-black text-white" : "bg-white text-gray-400 shadow-sm"
                  )}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Term Based</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Divided into semesters, trimesters, or quarters.
                  </p>
                  {structure === "term" && (
                    <div className="absolute top-6 right-6 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setStructure("continuous")}
                  className={cn(
                    "relative p-8 rounded-[24px] border-2 text-left transition-all duration-300 group",
                    structure === "continuous" ? "border-black bg-white shadow-xl shadow-black/[0.03]" : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors",
                    structure === "continuous" ? "bg-black text-white" : "bg-white text-gray-400 shadow-sm"
                  )}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Continuous</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Rolling admissions with self-paced progression.
                  </p>
                  {structure === "continuous" && (
                    <div className="absolute top-6 right-6 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-2">Fee Setup</h2>
                <p className="text-gray-500 font-medium">Configure base currency and payment terms.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Primary Currency</label>
                  <select className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base appearance-none cursor-pointer">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>KES (KSh)</option>
                    <option>NGN (₦)</option>
                    <option>ZAR (R)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Tax/VAT Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter tax number"
                    className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold mb-2">Invite Your Team</h2>
                <p className="text-gray-500 font-medium">Add staff members to help manage the institution.</p>
              </div>

              <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="staff@school.com"
                    className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                  />
                </div>
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Role</label>
                  <select className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base appearance-none cursor-pointer">
                    <option>Admin</option>
                    <option>Teacher</option>
                    <option>Accountant</option>
                    <option>Registrar</option>
                  </select>
                </div>
                <button type="button" className="h-14 px-8 border border-gray-100 rounded-xl font-bold text-sm text-white bg-black  hover:bg-black/50  transition-colors whitespace-nowrap">
                  Send Invite
                </button>
              </div>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  <span className="bg-white px-6">OR BULK UPLOAD</span>
                </div>
              </div>

              <div
                onClick={() => bulkInputRef.current?.click()}
                className="border-2 border-dashed border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <input
                  type="file"
                  ref={bulkInputRef}
                  className="hidden"
                  accept=".csv, .xlsx"
                  onChange={handleBulkUpload}
                />
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {uploadingBulk ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CloudUpload className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-black mb-1">
                    {uploadingBulk ? "Uploading staff list..." : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider font-sans">XLSX, CSV (Max 5MB)</p>
                </div>
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3 tracking-tight text-black">Choose your role</h2>
                <p className="text-gray-500 text-lg font-medium">Select how you will be using Blink Campus.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "admin", title: "Administrator", desc: "Manage settings, users, and overall institution data.", icon: ShieldCheck },
                  { id: "teacher", title: "Teacher", desc: "Manage classes, assignments, and student progress.", icon: Users },
                  { id: "student", title: "Student", desc: "Access courses, submit assignments, and view grades.", icon: GraduationCap },
                ].map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        "relative flex flex-col p-8 rounded-[32px] border-2 text-left transition-all duration-300 group",
                        isSelected ? "border-black bg-white shadow-2xl shadow-black/[0.03]" : "border-gray-50 bg-white hover:border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors",
                        isSelected ? "bg-black text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-black mb-2">{role.title}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{role.desc}</p>
                      <div className={cn(
                        "absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-black border-black" : "border-gray-100"
                      )}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto pt-10 flex items-center justify-between border-t border-gray-50">
            <button
              onClick={prevStep}
              className={cn(
                "flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold text-sm px-2",
                step === 1 && "invisible"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <Button
              onClick={nextStep}
              loading={loading}
              className="h-14 px-10 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-base font-bold"
            >
              {step === STEPS.length ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

