const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// USER ROUTES

//  Get logged-in user's tasks (with pagination)
router.get("/", auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const { status, priority } = req.query;

  // BASE QUERY (user specific)
  const query = { user: req.user._id };

  // APPLY FILTERS IF PRESENT
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const total = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    tasks,
    totalPages: Math.ceil(total / limit),
  });
});


// Get single task details (USER)
router.get("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // user can access only own task
  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(task);
});

// Create task (USER)
router.post("/", auth, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    status: "pending",
    user: req.user._id,
  });

  await task.save();
  res.json(task);
});

// Update task status (USER)
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  task.status = req.body.status || task.status;
  await task.save();

  res.json(task);
});

// Delete task (USER)
router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
});

// ADMIN ROUTES

//  ADMIN: Get all users with their tasks
router.get("/admin/users", auth, admin, async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  const result = [];

  for (let user of users) {
    const tasks = await Task.find({ user: user._id }).sort({
      createdAt: -1,
    });

    result.push({
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      tasks,
    });
  }

  res.json(result);
});

//  ADMIN: Update any task status
router.put("/admin/task/:id", auth, admin, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.status = req.body.status;
  await task.save();

  res.json(task);
});

// ADMIN: Delete any task
router.delete("/admin/task/:id", auth, admin, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted by admin" });
});

// ADMIN: Analytics
router.get("/admin/analytics", auth, admin, async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const activeUsers = await User.countDocuments({ role: "user", isActive: true });
  const disabledUsers = totalUsers - activeUsers;
  
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: "completed" });
  const pendingTasks = totalTasks - completedTasks;

  res.json({
    users: {
      total: totalUsers,
      active: activeUsers,
      disabled: disabledUsers,
    },
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
    },
  });
});

module.exports = router;
