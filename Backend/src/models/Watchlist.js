const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
  },
  { timestamps: true },
);

watchlistSchema.index({ user: 1, content: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);
