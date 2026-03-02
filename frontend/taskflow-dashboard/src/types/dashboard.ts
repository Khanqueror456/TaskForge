export type TaskState = "queued" | "pending" | "running" | "completed" | "failed" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  name: string;
  state: TaskState;
  priority: TaskPriority;
  worker: string | null;
  dependencies: string[];
  createdAt: string;
  duration: number | null;
}

export interface Worker {
  id: string;
  name: string;
  status: "idle" | "busy" | "offline";
  currentTask: string | null;
  cpu: number;
  memory: number;
  uptime: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  source: string;
}

export interface DashboardStatsData {
  total: number;
  running: number;
  completed: number;
  failed: number;
  queued: number;
  activeWorkers: number;
  totalWorkers: number;
}
