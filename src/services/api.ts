import { Task, Worker, LogEntry, DashboardStatsData, TaskState } from "@/types/dashboard";

// Mock data generators
let taskIdCounter = 6;
let logIdCounter = 20;

const TASK_NAMES = [
  "Build Docker image",
  "Run unit tests",
  "Deploy to staging",
  "Database migration",
  "Generate reports",
  "Sync S3 bucket",
  "Lint codebase",
  "Run integration tests",
  "Cache warmup",
  "SSL cert renewal",
];

const WORKER_NAMES = ["worker-alpha-01", "worker-beta-02", "worker-gamma-03", "worker-delta-04"];

const LOG_LEVELS: LogEntry["level"][] = ["info", "warn", "error", "debug"];

const LOG_MESSAGES = [
  "Task execution started",
  "Connecting to remote server...",
  "Downloading dependencies",
  "Build step completed successfully",
  "Warning: deprecated API usage detected",
  "Error: connection timeout after 30s",
  "Retrying operation (attempt 2/3)",
  "Cache hit ratio: 87.3%",
  "Memory usage: 342MB / 512MB",
  "Worker heartbeat received",
  "Pipeline stage 2/5 complete",
  "Artifact uploaded to registry",
  "Health check passed",
  "Rolling deployment in progress",
  "Debug: queue depth = 14",
];

export const initialTasks: Task[] = [
  { id: "task-1", name: "Build Docker image", state: "completed", priority: "high", worker: "worker-alpha-01", dependencies: [], createdAt: new Date(Date.now() - 3600000).toISOString(), duration: 124 },
  { id: "task-2", name: "Run unit tests", state: "running", priority: "medium", worker: "worker-beta-02", dependencies: ["task-1"], createdAt: new Date(Date.now() - 1800000).toISOString(), duration: 67 },
  { id: "task-3", name: "Deploy to staging", state: "pending", priority: "high", worker: null, dependencies: ["task-1", "task-2"], createdAt: new Date(Date.now() - 900000).toISOString(), duration: null },
  { id: "task-4", name: "Database migration", state: "failed", priority: "critical", worker: "worker-gamma-03", dependencies: [], createdAt: new Date(Date.now() - 7200000).toISOString(), duration: 45 },
  { id: "task-5", name: "Generate reports", state: "queued", priority: "low", worker: null, dependencies: ["task-2"], createdAt: new Date(Date.now() - 600000).toISOString(), duration: null },
];

export const initialWorkers: Worker[] = [
  { id: "worker-alpha-01", name: "worker-alpha-01", status: "busy", currentTask: "task-2", cpu: 78, memory: 64, uptime: 14400 },
  { id: "worker-beta-02", name: "worker-beta-02", status: "busy", currentTask: "task-2", cpu: 45, memory: 52, uptime: 28800 },
  { id: "worker-gamma-03", name: "worker-gamma-03", status: "idle", currentTask: null, cpu: 12, memory: 31, uptime: 43200 },
  { id: "worker-delta-04", name: "worker-delta-04", status: "offline", currentTask: null, cpu: 0, memory: 0, uptime: 0 },
];

export function generateLog(): LogEntry {
  const level = LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)];
  const message = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
  const worker = WORKER_NAMES[Math.floor(Math.random() * WORKER_NAMES.length)];
  logIdCounter++;
  return {
    id: `log-${logIdCounter}`,
    timestamp: new Date().toISOString(),
    level,
    message,
    source: worker,
  };
}

export function generateInitialLogs(): LogEntry[] {
  const logs: LogEntry[] = [];
  for (let i = 0; i < 15; i++) {
    logs.push({
      ...generateLog(),
      timestamp: new Date(Date.now() - (15 - i) * 5000).toISOString(),
    });
  }
  return logs;
}

export function createTask(name: string, priority: Task["priority"], dependencies: string[]): Task {
  taskIdCounter++;
  return {
    id: `task-${taskIdCounter}`,
    name,
    state: "queued",
    priority,
    worker: null,
    dependencies,
    createdAt: new Date().toISOString(),
    duration: null,
  };
}

export function getStats(tasks: Task[], workers: Worker[]): DashboardStatsData {
  const total = tasks.length;
  const running = tasks.filter(t => t.state === "running").length;
  const completed = tasks.filter(t => t.state === "completed").length;
  const failed = tasks.filter(t => t.state === "failed").length;
  const queued = tasks.filter(t => t.state === "queued" || t.state === "pending").length;
  const activeWorkers = workers.filter(w => w.status !== "offline").length;
  const totalWorkers = workers.length;

  return { total, running, completed, failed, queued, activeWorkers, totalWorkers };
}
