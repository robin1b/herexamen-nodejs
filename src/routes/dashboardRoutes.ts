import express from "express";
import { Task } from "../models/taskModel";
import { FilterQuery } from "mongoose";
const router = express.Router();

router.get("/", async (req, res) => {
  const { category, priority } = req.query;

  const filters: FilterQuery<typeof Task> = {};

  if (category) {
    filters.category = { $regex: `^${category}$`, $options: "i" };
  }

  if (priority) {
    filters.priority = { $regex: `^${priority}$`, $options: "i" };
  }

  filters.$or = [
    { dueDate: { $gte: new Date() } },
    { dueDate: { $exists: false } },
  ];

  try {
    const tasks = await Task.find(filters).sort({ dueDate: 1 });
    res.render("dashboard", { tasks });
  } catch (err) {
    res.status(500).send("Fout bij ophalen dashboard");
  }
});

export default router;
