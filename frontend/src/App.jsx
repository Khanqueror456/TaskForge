import { useEffect, useState } from "react";
import { getTasks } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "pending";
      case "Ready":
        return "ready";
      case "Running":
        return "running";
      case "Completed":
        return "completed";
      case "Failed":
        return "failed";
      default:
        return "";
    }
  };

  return (
    <div className="container">
      <h1>TaskForge Dashboard</h1>

      <div className="grid">
        {tasks.map((task) => (
          <div key={task._id} className="card">
            <h3>{task.name}</h3>
            <p>Priority: {task.priority}</p>
            <p className={getStatusClass(task.status)}>
              {task.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}