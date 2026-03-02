import { Worker } from "@/types/dashboard";
import { Server, Cpu, HardDrive, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface WorkerPanelProps {
  workers: Worker[];
}

const statusStyles: Record<string, { dot: string; label: string }> = {
  idle: { dot: "bg-success", label: "text-success" },
  busy: { dot: "bg-primary animate-pulse-glow", label: "text-primary" },
  offline: { dot: "bg-muted-foreground", label: "text-muted-foreground" },
};

function formatUptime(seconds: number): string {
  if (seconds === 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function UsageBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export default function WorkerPanel({ workers }: WorkerPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" /> Worker Fleet
        </h3>
      </div>
      <div className="divide-y divide-border/50">
        {workers.map((w, i) => {
          const style = statusStyles[w.status];
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <span className="font-mono text-sm">{w.name}</span>
                </div>
                <span className={`text-xs font-mono uppercase ${style.label}`}>{w.status}</span>
              </div>
              {w.status !== "offline" && (
                <div className="space-y-1.5 ml-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Cpu className="h-3 w-3" />
                    <span className="w-8 font-mono">{w.cpu}%</span>
                    <UsageBar value={w.cpu} color={w.cpu > 70 ? "bg-accent" : "bg-primary"} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HardDrive className="h-3 w-3" />
                    <span className="w-8 font-mono">{w.memory}%</span>
                    <UsageBar value={w.memory} color={w.memory > 80 ? "bg-destructive" : "bg-primary"} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{formatUptime(w.uptime)}</span>
                  </div>
                  {w.currentTask && (
                    <span className="text-xs font-mono text-primary/70">→ {w.currentTask}</span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
