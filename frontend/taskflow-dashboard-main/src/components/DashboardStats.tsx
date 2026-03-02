import { DashboardStatsData } from "@/types/dashboard";
import { Activity, CheckCircle, XCircle, Clock, Layers, Server } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

const statCards = [
  { key: "total", label: "Total Tasks", icon: Layers, variant: "default" as const },
  { key: "running", label: "Running", icon: Activity, variant: "primary" as const },
  { key: "completed", label: "Completed", icon: CheckCircle, variant: "success" as const },
  { key: "failed", label: "Failed", icon: XCircle, variant: "destructive" as const },
  { key: "queued", label: "Queued", icon: Clock, variant: "warning" as const },
  { key: "activeWorkers", label: "Workers", icon: Server, variant: "primary" as const },
];

const variantStyles = {
  default: "border-border",
  primary: "border-primary/30 glow-primary",
  success: "border-success/30 glow-success",
  destructive: "border-destructive/30 glow-destructive",
  warning: "border-accent/30 glow-accent",
};

const iconStyles = {
  default: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-accent",
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        const value = card.key === "activeWorkers"
          ? `${stats.activeWorkers}/${stats.totalWorkers}`
          : stats[card.key as keyof DashboardStatsData];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-lg border bg-card p-4 ${variantStyles[card.variant]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <Icon className={`h-4 w-4 ${iconStyles[card.variant]}`} />
            </div>
            <p className="text-2xl font-bold font-mono">{value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
