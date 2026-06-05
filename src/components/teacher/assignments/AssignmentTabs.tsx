import React from "react";
import { cn } from "@/lib/utils";
import { AssignmentStats } from "./types";

interface AssignmentTabsProps {
  activeTab: string;
  stats: AssignmentStats;
  onTabChange: (tab: string) => void;
}

export const AssignmentTabs: React.FC<AssignmentTabsProps> = ({
  activeTab,
  stats,
  onTabChange,
}) => {
  const tabs = [
    { label: "All", count: stats.total },
    { label: "Active", count: stats.active },
    { label: "Graded", count: stats.graded },
    { label: "Draft", count: stats.drafts },
  ];

  return (
    <div className="assignments-tabs-container">
      {tabs.map((tab) => (
        <div
          key={tab.label}
          onClick={() => onTabChange(tab.label)}
          className={cn("assignments-tab", activeTab === tab.label && "active")}
        >
          {tab.label} ({tab.count})
        </div>
      ))}
    </div>
  );
};

