import Task from "../models/Task.js";
import { canTransition } from "./stateMachine.js";

export const pickNextTask = async () => {
    const task = await Task.findOneAndUpdate(
        {status : "Ready"},
        {status : "Running", startedAt : new Date()},
        {
            sort : {priority : -1, createdAt: 1},
            returnDocument : "after"
        }
    );

    return task;
};

export const startWorker = (workerId) => {
    setInterval(async () => {
        try{
            const task = await pickNextTask();

            if (!task) return;

            console.log(`Worker ${workerId} executing ${task.name}`);

            setTimeout(async () => {
                if (canTransition(task.status, "Completed")){
                    await Task.findByIdAndUpdate(task._id, {
                        status : "Completed",
                        finishedAt : new Date()
                    });

                    console.log(`Worker ${workerId} completed ${task.name}`);
                }
            }, task.executionTime);
        } catch (error){
            console.error(`Worker ${workerId} error:`, error);
        }
    }, 1000);
};