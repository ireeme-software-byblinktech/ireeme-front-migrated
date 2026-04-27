"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        
        {/* Back to Login */}
        {!submitted && (
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-bold">Back to login</span>
          </Link>
        )}

        {!submitted ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h1 className="text-[32px] font-bold tracking-tight text-black mb-3">Forgot password?</h1>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base"
                    required
                  />
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

            <h2 className="text-[32px] font-bold tracking-tight text-black mb-3">Check your email</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
              We&apos;ve sent a password reset link to <span className="text-black font-bold">{email}</span>
            </p>

            <Button 
              onClick={() => router.push("/login")}
              className="w-full h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all text-base font-bold shadow-lg shadow-black/5 mb-6"
            >
              Back to Login
            </Button>

            <p className="text-sm text-gray-400 font-medium">
              Didn&apos;t receive the email?{" "}
              <button 
                onClick={() => setSubmitted(false)}
                className="text-black font-bold hover:underline"
              >
                Click to try again
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50/50 rounded-full blur-[120px] -mr-64 -mt-64 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-50/50 rounded-full blur-[100px] -ml-32 -mb-32 -z-10"></div>
    </div>
  );
}
