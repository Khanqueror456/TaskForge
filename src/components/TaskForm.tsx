import { useState } from "react";
import { Task, TaskPriority } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface TaskFormProps {
  existingTasks: Task[];
  onSubmit: (name: string, priority: TaskPriority, dependencies: string[]) => void;
}

export default function TaskForm({ existingTasks, onSubmit }: TaskFormProps) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [deps, setDeps] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), priority, deps);
    setName("");
    setDeps([]);
  };

  const toggleDep = (id: string) => {
    setDeps(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Plus className="h-4 w-4 text-primary" /> Create Task
      </h3>
      <Input
        placeholder="Task name..."
        value={name}
        onChange={e => setName(e.target.value)}
        className="bg-muted border-border font-mono text-sm"
      />
      <div className="flex gap-2">
        <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
          <SelectTrigger className="bg-muted border-border text-sm flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono text-xs">
          Submit
        </Button>
      </div>
      {existingTasks.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Dependencies:</p>
          <div className="flex flex-wrap gap-1">
            {existingTasks.map(t => (
              <button
                type="button"
                key={t.id}
                onClick={() => toggleDep(t.id)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  deps.includes(t.id)
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-muted text-muted-foreground border border-border hover:border-primary/30"
                }`}
              >
                {t.id}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
