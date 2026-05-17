import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "glass-card rounded-[2rem] p-6 shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1",
              trend.isPositive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            )}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-bold text-foreground tracking-tight mb-1">{value}</p>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs font-medium text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
