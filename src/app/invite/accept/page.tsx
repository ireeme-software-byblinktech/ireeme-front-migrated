"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ArrowRight, Building, User, Mail, Eye, EyeOff } from "lucide-react";

export default function InviteAcceptPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push("/setup/success");
  };

  return (
    <div className="min-h-screen bg-gray-50/20 font-sans py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-[440px]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold tracking-tight text-black mb-2">You&apos;ve been invited</h1>
          <p className="text-gray-500 text-lg font-medium">Join Blink International School to start collaborating.</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/[0.02] overflow-hidden mb-8">
          <div className="p-6 bg-gray-50/50 flex items-start gap-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Building className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-black">Blink International School</h3>
              <p className="text-xs text-gray-500 font-medium">Invited by Admin</p>
            </div>
          </div>
          <div className="p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-black">alex@example.com</h3>
              <p className="text-xs text-gray-500 font-medium">Role: Teacher</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAccept} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Alex Johnson"
              className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Create Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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

          <Button 
            type="submit" 
            loading={loading}
            className="w-full h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-black/5"
          >
            Accept Invitation <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
