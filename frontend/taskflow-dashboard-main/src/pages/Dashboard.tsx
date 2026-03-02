import { useState, useEffect, useCallback } from "react";
import { Task, Worker, LogEntry, TaskPriority } from "@/types/dashboard";
import { fetchTasks, fetchWorkers, fetchLogs, createTask, getStats, generateMockLog } from "@/services/api";
import DashboardStats from "@/components/DashboardStats";
import TaskForm from "@/components/TaskForm";
import TaskTable from "@/components/TaskTable";
import WorkerPanel from "@/components/WorkerPanel";
import LogsPanel from "@/components/LogsPanel";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    async function loadData() {
      const [t, w, l] = await Promise.all([fetchTasks(), fetchWorkers(), fetchLogs()]);
      setTasks(t);
      setWorkers(w);
      setLogs(l);
      setLoading(false);
    }
    loadData();
  }, []);

  // Poll for updates every 5s (replace with WebSocket when backend supports it)
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(async () => {
      try {
        const [t, w] = await Promise.all([fetchTasks(), fetchWorkers()]);
        setTasks(t);
        setWorkers(w);
      } catch {
        // If polling fails, simulate locally
        setLogs(prev => [...prev, generateMockLog()].slice(-50));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  // Simulate log streaming (will be replaced by WebSocket/SSE from backend)
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, generateMockLog()].slice(-50));
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleCreateTask = useCallback(async (name: string, priority: TaskPriority, dependencies: string[]) => {
    const task = await createTask(name, priority, dependencies);
    setTasks(prev => [...prev, task]);
    setLogs(prev => [...prev, {
      id: `log-create-${task.id}`,
      timestamp: new Date().toISOString(),
      level: "info" as const,
      message: `Task "${name}" created with priority ${priority}`,
      source: "system",
    }]);
  }, []);

  const stats = getStats(tasks, workers);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          Connecting to backend...
        </div>
      </div>
    );
  }

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
