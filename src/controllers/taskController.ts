// src/controllers/taskController.ts

import { Request, Response } from "express";
import { Task } from "../models/taskModel";
import mongoose, { Error as MongooseError, FilterQuery } from "mongoose";

const { ValidationError } = MongooseError;

export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: "Validatiefout", error: error.message });
    } else {
      res.status(500).json({ message: "Fout bij aanmaken taak" });
    }
  }
};

export const getTasks = async (req: Request, res: Response) => {
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

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Fout bij ophalen taken", error });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Ongeldige taak-ID" });
  }

  try {
    const task = await Task.findOne({
      _id: id,
      $or: [{ dueDate: { $gte: new Date() } }, { dueDate: { $exists: false } }],
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Taak niet gevonden of verlopen" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Fout bij ophalen taak", error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Ongeldige taak-ID" });
  }

  try {
    const existing = await Task.findOne({
      _id: id,
      $or: [{ dueDate: { $gte: new Date() } }, { dueDate: { $exists: false } }],
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Taak niet gevonden of verlopen" });
    }

    const updated = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Fout bij bijwerken taak", error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Ongeldige taak-ID" });
  }

  try {
    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Taak niet gevonden" });
    }

    res
      .status(200)
      .json({ message: "Taak succesvol verwijderd", task: deleted });
  } catch (error) {
    res.status(500).json({ message: "Fout bij verwijderen taak", error });
  }
};
