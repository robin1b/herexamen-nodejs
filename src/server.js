// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import { notFound } from "./controllers/notFoundController";
import testRoutes from "./routes/exampleRoutes";
import { helloMiddleware } from "./middleware/exampleMiddleware";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes";
import path from "path";
import { fileURLToPath } from "url";
import dashboardRoutes from "./routes/dashboardRoutes";
// Variables
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api", helloMiddleware, testRoutes);
app.all("*", notFound);
// Database connection
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection OK");
}
catch (err) {
    console.error(err);
    process.exit(1);
}
// Server Listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}! 🚀`);
});
