import { useState, useEffect, useCallback } from "react";
import { Task, Worker, LogEntry, TaskPriority } from "@/types/dashboard";
import { initialTasks, initialWorkers, generateInitialLogs, generateLog, createTask, getStats } from "@/services/api";
import DashboardStats from "@/components/DashboardStats";
import TaskForm from "@/components/TaskForm";
import TaskTable from "@/components/TaskTable";
import WorkerPanel from "@/components/WorkerPanel";
import LogsPanel from "@/components/LogsPanel";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [logs, setLogs] = useState<LogEntry[]>(generateInitialLogs);

  // Simulate real-time log streaming
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, generateLog()];
        return next.slice(-50); // keep last 50
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Simulate task state changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => {
        const updated = [...prev];
        const running = updated.filter(t => t.state === "running");
        const queued = updated.filter(t => t.state === "queued");

        // Randomly complete a running task
        if (running.length > 0 && Math.random() > 0.6) {
          const task = running[Math.floor(Math.random() * running.length)];
          const idx = updated.findIndex(t => t.id === task.id);
          updated[idx] = { ...task, state: Math.random() > 0.15 ? "completed" : "failed", duration: (task.duration || 0) + Math.floor(Math.random() * 30) + 10 };
        }

        // Move a queued task to running
        if (queued.length > 0 && Math.random() > 0.5) {
          const task = queued[0];
          const idx = updated.findIndex(t => t.id === task.id);
          const freeWorker = workers.find(w => w.status === "idle");
          updated[idx] = { ...task, state: "running", worker: freeWorker?.name || "worker-alpha-01" };
        }

        return updated;
      });

      // Simulate worker metric changes
      setWorkers(prev => prev.map(w => {
        if (w.status === "offline") return w;
        return {
          ...w,
          cpu: Math.max(5, Math.min(95, w.cpu + Math.floor(Math.random() * 20) - 10)),
          memory: Math.max(10, Math.min(90, w.memory + Math.floor(Math.random() * 10) - 5)),
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [workers]);

  const handleCreateTask = useCallback((name: string, priority: TaskPriority, dependencies: string[]) => {
    const task = createTask(name, priority, dependencies);
    setTasks(prev => [...prev, task]);
    setLogs(prev => [...prev, {
      id: `log-create-${task.id}`,
      timestamp: new Date().toISOString(),
      level: "info",
      message: `Task "${name}" created with priority ${priority}`,
      source: "system",
    }]);
  }, []);

  const stats = getStats(tasks, workers);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">TASK ORCHESTRATOR</h1>
              <p className="text-xs text-muted-foreground font-mono">admin monitoring dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">system online</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <DashboardStats stats={stats} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <TaskTable tasks={tasks} />
            <LogsPanel logs={logs} />
          </div>
          <div className="space-y-6">
            <TaskForm existingTasks={tasks} onSubmit={handleCreateTask} />
            <WorkerPanel workers={workers} />
          </div>
        </div>
      </main>
    </div>
  );
}
