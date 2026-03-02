import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        name : { type : String, required : true},
        priority : { type : Number, min : 1, max : 5, required : true},
        executionTime : { type : Number, required : true},
        status : {
            type : String,
            enum : ["Pending", "Ready", "Running", "Completed", "Failed"],
            default : "Pending",
        },
        dependencies : [
            { type : mongoose.Schema.Types.ObjectId, ref : "Task"}
        ],
        startedAt : Date,
        finishedAt : Date,
    },
    { timestamps : true}
);

const Task = mongoose.model("Task", taskSchema);
export default Task;