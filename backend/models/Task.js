const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    dueDate: Date,
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    status: { type: String, default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
