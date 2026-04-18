import { HTMLAttributes } from "react";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  percentage?: string;
  description?: string;
  trend?: "up" | "down";
}

export function StatCard({
  title,
  value,
  icon,
  percentage,
  description,
  trend = "up",
  className = "",
  ...props
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...props}>
      <div className="flex items-center gap-6">
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          
          {(percentage || description) && (
            <div className="flex items-center gap-2 text-sm mt-1">
              {percentage && (
                <span className={`font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trend === "up" ? "↗" : "↘"} {percentage}
                </span>
              )}
              {description && (
                <span className="text-gray-500">{description}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
