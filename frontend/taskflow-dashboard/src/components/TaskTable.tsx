import { Task } from "@/types/dashboard";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
}

const stateColors: Record<string, string> = {
  queued: "bg-muted-foreground/20 text-muted-foreground",
  pending: "bg-accent/20 text-accent",
  running: "bg-primary/20 text-primary",
  completed: "bg-success/20 text-success",
  failed: "bg-destructive/20 text-destructive",
  cancelled: "bg-muted-foreground/20 text-muted-foreground",
};

const priorityColors: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-foreground",
  high: "text-accent",
  critical: "text-destructive",
};

const stateDots: Record<string, string> = {
  running: "bg-primary animate-pulse-glow",
  completed: "bg-success",
  failed: "bg-destructive",
  queued: "bg-muted-foreground",
  pending: "bg-accent",
  cancelled: "bg-muted-foreground",
};

export default function TaskTable({ tasks }: TaskTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" /> Task Pipeline
        </h3>
      </div>
      <div className="overflow-x-auto terminal-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="text-left px-4 py-2 font-medium">ID</th>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">State</th>
              <th className="text-left px-4 py-2 font-medium">Priority</th>
              <th className="text-left px-4 py-2 font-medium">Worker</th>
              <th className="text-left px-4 py-2 font-medium">Deps</th>
              <th className="text-right px-4 py-2 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-2.5 font-mono text-xs text-primary">{task.id}</td>
                <td className="px-4 py-2.5 font-medium">{task.name}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono ${stateColors[task.state]}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${stateDots[task.state]}`} />
                    {task.state}
                  </span>
                </td>
                <td className={`px-4 py-2.5 text-xs font-mono uppercase ${priorityColors[task.priority]}`}>
                  {task.priority}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                  {task.worker || "—"}
                </td>
                <td className="px-4 py-2.5">
                  {task.dependencies.length > 0 ? (
                    <div className="flex items-center gap-1">
                      {task.dependencies.map((d, j) => (
                        <span key={d}>
                          <span className="text-xs font-mono text-primary/70">{d}</span>
                          {j < task.dependencies.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground inline mx-0.5" />}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">none</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-xs text-muted-foreground">
                  {task.duration ? `${task.duration}s` : "—"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
