import { Todo } from "../models/exampleModel";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
export const getHelloWorld = (req, res) => {
    res.status(200).json({ message: "Hello World!" });
};
export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
};
export const addTodo = async (req, res) => {
    try {
        const { task } = req.body;
        const todo = await Todo.create({ task });
        res.status(201).json(todo);
    }
    catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ message: error.message });
        }
        else if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
};
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { task, done } = req.body;
        const todo = await Todo.findByIdAndUpdate(id, { task, done }, { new: true });
        res.status(200).json(todo);
    }
    catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({ message: error.message });
        }
        else if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
};
