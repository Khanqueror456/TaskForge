import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
    {
        type : String,
        message : String,
        taskId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Task"
        }
    },
    {timestamps : true}
);

const Log = mongoose.model("Log", logSchema);
export default Log;