import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"],
        lowercase: true,
        trim: true,
    },
    dueDate: {
        type: Date,
    },
}, {
    timestamps: true,
});
export const Task = mongoose.model("Task", taskSchema);
