"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-16 text-white relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white opacity-[0.02] rounded-full blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-40">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Blink Campus</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-[56px] font-bold leading-[1.1] mb-8 tracking-tight">
              The minimal, elegant way to run your institution.
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              No clutter. No complex menus. Just pure focus on what matters most — education.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm font-medium text-gray-500">
          <span>Powered by Blink Tech</span>
          <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
          <span>ERP System</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-24 bg-white">
        <div className="w-full max-w-[400px]">
          <div className="mb-12">
            <h2 className="text-[32px] font-bold mb-3 tracking-tight text-black">Welcome back</h2>
            <p className="text-gray-500 text-lg">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email or Phone</label>
              <input
                type="text"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
              </div>
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
              <div className="flex justify-end pr-1 pt-1">
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-bold text-gray-400 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-base font-bold shadow-lg shadow-black/5"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-6 text-gray-400 font-bold tracking-widest">OR</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => router.push("/register")}
                className="h-14 border border-gray-300 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-800"
              >
                Create School
              </button>
              <button 
                type="button"
                className="h-14 border border-transparent bg-gray-100 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center text-black"
              >
                Join via Invite
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-black font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
