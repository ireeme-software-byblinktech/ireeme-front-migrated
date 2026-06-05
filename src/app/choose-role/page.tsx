"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Users, GraduationCap, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    id: "admin",
    title: "Administrator",
    description: "Manage settings, users, and overall institution data.",
    icon: ShieldCheck,
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Manage classes, assignments, and student progress.",
    icon: Users,
  },
  {
    id: "student",
    title: "Student",
    description: "Access courses, submit assignments, and view grades.",
    icon: GraduationCap,
  },
];

export default function ChooseRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl text-center mb-16">
        <h1 className="text-[40px] font-bold tracking-tight text-black mb-3">Choose your role</h1>
        <p className="text-gray-500 text-lg font-medium">Select how you will be using Blink Campus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        {ROLES.map((role) => {
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
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors",
                isSelected ? "bg-black text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
              )}>
                <Icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-black mb-3">{role.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {role.description}
              </p>

              {/* Selection Circle */}
              <div className={cn(
                "absolute top-8 right-8 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                isSelected ? "bg-black border-black" : "border-gray-100"
              )}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        disabled={!selectedRole}
        onClick={() => router.push(`/${selectedRole}`)}
        className={cn(
          "h-14 px-12 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2",
          selectedRole ? "bg-black text-white shadow-lg shadow-black/10" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

