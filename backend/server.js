const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// MIDDLEWARES

app.use(cors());
app.use(express.json());

// ROOT ROUTE (IMPORTANT)

app.get("/", (req, res) => {
  res.send("Task Manager API is running ");
});

// ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// DATABASE + SERVER

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
