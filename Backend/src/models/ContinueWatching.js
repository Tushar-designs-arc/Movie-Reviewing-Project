const mongoose = require("mongoose");

const continueWatchingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    duration: { type: Number, min: 0, default: 0 },
    lastWatchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

continueWatchingSchema.index({ user: 1, content: 1 }, { unique: true });

module.exports = mongoose.model("ContinueWatching", continueWatchingSchema);
