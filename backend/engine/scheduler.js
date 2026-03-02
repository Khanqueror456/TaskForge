import Task from "../models/Task.js";
import { canTransition } from "./stateMachine.js";
import PriorityQueue from "./priorityQueue.js";

export const runScheduler = async () => {
    try {

        const pendingTasks = await Task.find({ status : "Pending"});

        for (let task of pendingTasks)
        {
            const dependencies = await Task.find({
                _id : {$in : task.dependencies}
            });

            const allCompleted = dependencies.every(
                dep => dep.status === "Completed"
            );

            if (allCompleted && canTransition(task.status, "Ready"))
            {
                task.status = "Ready",
                await task.save();

                console.log(`Task ${task.name} moved to READY`);
            }
        } 
    }catch (error) {
            console.error("Scheduler error:", error);
        }
};

export const getNextTaskFromQueue = async () => {
    const readyTasks = await Task.find({ status : "Ready"});

    if (readyTasks.length === 0) return null;

    const pq = new PriorityQueue();

    readyTasks.forEach(task => {
        pq.enqueue(task);
    });

    return pq.dequeue();
}