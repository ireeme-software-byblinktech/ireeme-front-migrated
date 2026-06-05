"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        
        {!success ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-[32px] font-bold tracking-tight text-black mb-3">Set new password</h1>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                Your new password must be different from previously used passwords.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 px-4 pr-12 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                loading={loading}
                className="w-full h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all text-base font-bold shadow-lg shadow-black/5"
              >
                Reset Password
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>

            <h2 className="text-[32px] font-bold tracking-tight text-black mb-3">Password reset</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <Button 
              onClick={() => router.push("/login")}
              className="w-full h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all text-base font-bold shadow-lg shadow-black/5 flex items-center justify-center gap-2"
            >
              Back to Login <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

