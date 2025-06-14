import express from "express";
import { Task } from "../models/taskModel";
import mongoose, { FilterQuery } from "mongoose";

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

router.get("/", async (req: express.Request, res: express.Response) => {
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

    const filters: FilterQuery<typeof Task> = {
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

router.get("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Ongeldig taak-ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Taak niet gevonden" });
    }

    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fout bij het ophalen van taak", error: err });
  }
});
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Ongeldige taak-ID" });
  }

  try {
    // Check of de taak bestaat en nog geldig is
    const existingTask = await Task.findOne({
      _id: id,
      $or: [{ dueDate: { $gte: new Date() } }, { dueDate: { $exists: false } }],
    });

    if (!existingTask) {
      return res
        .status(404)
        .json({ message: "Taak niet gevonden of verlopen" });
    }

    // Update de taak
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Fout bij updaten taak", error: error.message });
    } else {
      res.status(500).json({ message: "Onbekende fout bij updaten taak" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Ongeldige taak-ID" });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Taak niet gevonden" });
    }

    res.json({ message: "Taak succesvol verwijderd", task: deletedTask });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Fout bij verwijderen taak", error: error.message });
    } else {
      res.status(500).json({ message: "Onbekende fout bij verwijderen taak" });
    }
  }
});

export default router;
