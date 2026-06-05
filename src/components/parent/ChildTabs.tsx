"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChildTabsProps {
  children: string[];
  selectedChild: string;
  onChildChange: (child: string) => void;
  label?: string;
}

export function ChildTabs({ 
  children, 
  selectedChild, 
  onChildChange,
  label = "Children :" 
}: ChildTabsProps) {
  return (
    <div className="mb-6">
      {label && <h3 className="text-sm font-bold text-gray-900 mb-3">{label}</h3>}
      <div className="flex flex-wrap gap-3">
        {children.map((child) => (
          <button
            key={child}
            onClick={() => onChildChange(child)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              selectedChild === child
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            {child}
          </button>
        ))}
      </div>
    </div>
  );
}

