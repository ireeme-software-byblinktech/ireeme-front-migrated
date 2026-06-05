"use client";

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md">
        {/* Animated Icon */}
        <div className="mb-10 flex justify-center">
          <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center animate-in zoom-in spin-in-12 duration-1000">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-black/[0.02]">
              <HelpCircle className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-[120px] font-black leading-none tracking-tighter text-black mb-4 select-none opacity-[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          404
        </h1>
        
        <div className="relative z-10">
          <h2 className="text-[32px] font-bold tracking-tight text-black mb-3">Page not found</h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed mb-12">
            The page you are looking for doesn&apos;t exist or has been moved to another location.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Link href="/login" passHref>
              <Button 
                className="w-full h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all text-base font-bold shadow-lg shadow-black/5 flex items-center justify-center gap-2"
              >
                <MoveLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </Link>
            <Link href="mailto:support@blinktech.com" className="text-sm font-bold text-gray-400 hover:text-black transition-colors py-2">
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50/50 rounded-full blur-[120px] -mr-64 -mt-64 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-50/50 rounded-full blur-[100px] -ml-32 -mb-32 -z-10"></div>
    </div>
  );
}

