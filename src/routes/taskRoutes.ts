import express from "express";
import { Task } from "../models/taskModel";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Fout bij het aanmaken van taak", error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      category,
      priority,
      sort = "dueDate",
      order = "asc",
      page = "1",
      limit = "10",
    } = req.query as {
      category?: string;
      priority?: string;
      sort?: string;
      order?: "asc" | "desc";
      page?: string;
      limit?: string;
    };

    const filters: Record<string, unknown> = {
      $or: [{ dueDate: { $gte: new Date() } }, { dueDate: { $exists: false } }],
    };

    if (category) {
      filters.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (priority) {
      filters.priority = { $regex: `^${priority}$`, $options: "i" };
    }

    const sortOptions: Record<string, 1 | -1> = {
      [sort]: order === "asc" ? 1 : -1,
    };

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const tasks = await Task.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Taken ophalen mislukt", error });
  }
});
export default router;
