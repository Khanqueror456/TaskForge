import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
    console.log("🚀 TaskForge Engine running on port 5000");
})