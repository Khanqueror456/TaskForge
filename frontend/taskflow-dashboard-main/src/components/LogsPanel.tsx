import { useEffect, useRef } from "react";
import { LogEntry } from "@/types/dashboard";
import { Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogsPanelProps {
  logs: LogEntry[];
}

const levelStyles: Record<string, string> = {
  info: "text-primary",
  warn: "text-accent",
  error: "text-destructive",
  debug: "text-muted-foreground",
};

const levelBadge: Record<string, string> = {
  info: "bg-primary/15 text-primary",
  warn: "bg-accent/15 text-accent",
  error: "bg-destructive/15 text-destructive",
  debug: "bg-muted text-muted-foreground",
};

export default function LogsPanel({ logs }: LogsPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" /> Live Logs
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-xs text-muted-foreground font-mono">streaming</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[400px] terminal-scrollbar p-2 space-y-0.5 bg-background/50">
        <AnimatePresence initial={false}>
          {logs.map(log => {
            const time = new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false });
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-2 py-1 px-2 rounded hover:bg-muted/30 font-mono text-xs leading-relaxed"
              >
                <span className="text-muted-foreground shrink-0">{time}</span>
                <span className={`px-1.5 py-0 rounded text-[10px] uppercase font-semibold shrink-0 ${levelBadge[log.level]}`}>
                  {log.level}
                </span>
                <span className="text-muted-foreground shrink-0">[{log.source}]</span>
                <span className={levelStyles[log.level]}>{log.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-2 border-t border-border flex items-center gap-1 text-muted-foreground">
        <span className="font-mono text-xs">$</span>
        <span className="animate-blink font-mono text-xs text-primary">▋</span>
      </div>
    </div>
  );
}
