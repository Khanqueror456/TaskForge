export const buildGraph = (tasks) => {
  const graph = {};

  tasks.forEach(task => {
    graph[task._id.toString()] = [];
  });

  tasks.forEach(task => {
    const taskId = task._id.toString();

    (task.dependencies || []).forEach(dep => {
      const depId = dep.toString();

      if (!graph[depId]) graph[depId] = [];
      graph[depId].push(taskId);
    });
  });

  return graph;
};

export const hasCycle = (graph) => {
  const visited = new Set();
  const recStack = new Set();

  const dfs = (node) => {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    for (let neighbor of graph[node] || []) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  };

  for (let node in graph) {
    if (dfs(node)) return true;
  }

  return false;
};