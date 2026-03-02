import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import { buildGraph, hasCycle } from "../engine/cycleDetection.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, priority, executionTime, dependencies } = req.body;

    const existingTasks = await Task.find();

    // Create temporary new task (not saved yet)
    const tempTask = {
      _id: new mongoose.Types.ObjectId(),
      name,
      priority,
      executionTime,
      status: "Pending",
      dependencies: dependencies || []
    };

    // Combine existing tasks + new task
    const allTasks = [
      ...existingTasks.map(t => t.toObject()),
      tempTask
    ];

    const graph = buildGraph(allTasks);

    if (hasCycle(graph)) {
      return res.status(400).json({
        message: "Cycle detected. Task rejected"
      });
    }

    const savedTask = await Task.create({
      name,
      priority,
      executionTime,
      dependencies
    });

    res.status(201).json(savedTask);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { dependencies } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });

    // Get ALL tasks
    const allTasks = await Task.find();

    // Modify the task in-memory
    const updatedTasks = allTasks.map(t => {
      if (t._id.toString() === task._id.toString()) {
        return {
          ...t.toObject(),
          dependencies: dependencies || []
        };
      }
      return t;
    });

    const graph = buildGraph(updatedTasks, { _id: null, dependencies: [] });

    if (hasCycle(graph)) {
      return res.status(400).json({ message: "Cycle detected" });
    }

    task.dependencies = dependencies;
    await task.save();

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;