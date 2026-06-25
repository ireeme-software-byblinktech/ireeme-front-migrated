"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CountryAutocomplete } from "@/components/ui/CountryAutocomplete";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    institutionName: "",
    type: "K-12 School",
    country: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authApi.register(formData);

      // Store the access token
      localStorage.setItem("accessToken", data.accessToken);

      // Redirect to setup
      router.push("/setup");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-[640px]">
        {/* Back Button */}
        <Link
          href="/login"
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold">Back to login</span>
        </Link>

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-[32px] font-bold tracking-tight text-black mb-2">Register Institution</h1>
          <p className="text-gray-500 text-lg">Setup your core details to get started.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/[0.02] p-8 md:p-10">
          <form onSubmit={handleRegister} className="space-y-10">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Institution Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-bottom border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Institution Info</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Institution Name</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="Blink International School"
                    className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base appearance-none cursor-pointer"
                    >
                      <option>K-12 School</option>
                      <option>University</option>
                      <option>College</option>
                      <option>Vocational Center</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Country</label>
                    <CountryAutocomplete
                      value={formData.country}
                      onChange={handleCountryChange}
                      placeholder="e.g. United States"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Account Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-bottom border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Admin Account</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      className="w-full h-14 px-4 pr-12 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-3/4 mx-auto h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-black/5"
            >
              Create Institution
            </Button>


            <p className="text-center text-[13px] text-gray-400 font-medium px-4">
              By creating an institution, you agree to our <Link href="/terms" className="text-black hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-black hover:underline">Privacy Policy</Link>.
            </p>

            <div className="pt-4 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-black font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

