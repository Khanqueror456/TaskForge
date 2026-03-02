const BASE_URL = "http://localhost:5000/api";

export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  return res.json();
};

export const getLogs = async () => {
  const res = await fetch(`${BASE_URL}/logs`);
  return res.json();
};