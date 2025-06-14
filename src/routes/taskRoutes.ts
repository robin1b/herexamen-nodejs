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

export default router;
