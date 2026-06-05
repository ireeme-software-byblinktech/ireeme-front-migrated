"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SetupSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in duration-500">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Check className="w-6 h-6 text-green-500 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-[32px] font-bold tracking-tight text-black mb-4">You&apos;re all set!</h1>
        <p className="text-gray-500 text-lg font-medium leading-relaxed mb-12">
          Your account has been created successfully. Welcome to the workspace.
        </p>

        {/* Button */}
        <Button 
          onClick={() => router.push("/admin")}
          className="w-full h-14 bg-black text-white rounded-xl hover:bg-gray-900 transition-all text-base font-bold shadow-lg shadow-black/5"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

