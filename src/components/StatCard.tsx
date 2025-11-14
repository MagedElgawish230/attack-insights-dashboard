import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "critical" | "warning" | "success";
}

export const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  const variantStyles = {
    default: "border-primary/30 bg-card",
    critical: "border-destructive/50 bg-destructive/5",
    warning: "border-warning/50 bg-warning/5",
    success: "border-success/50 bg-success/5",
  };

  const iconStyles = {
    default: "text-primary",
    critical: "text-destructive",
    warning: "text-warning",
    success: "text-success",
  };

  return (
    <Card className={cn(
      "p-6 border-2 transition-all duration-500 card-3d glow-3d",
      "hover:shadow-2xl hover:shadow-primary/30",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn("text-sm font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              {trend.isPositive ? "+" : ""}{trend.value}% from last hour
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg bg-background/50 transform transition-transform duration-300 hover:scale-110 hover:rotate-6",
          iconStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
