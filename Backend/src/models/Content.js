const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["movie", "webseries", "show", "serial"],
      required: true,
      index: true,
    },
    genre: [{ type: String, index: true }],
    releaseYear: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    poster: { type: String, required: true },
    banner: { type: String, required: true },
    trailerUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    duration: { type: String, default: "" },
    seasons: { type: Number, default: 0 },
    episodes: { type: Number, default: 1 },
    language: { type: String, default: "Hindi" },
    maturity: { type: String, default: "UA 13+" },
    cast: [{ type: String }],
    director: { type: String, default: "" },
    tags: [{ type: String }],
    isTrending: { type: Boolean, default: false, index: true },
    isPopular: { type: Boolean, default: false, index: true },
    isRecentlyAdded: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

contentSchema.index({ title: "text", description: "text", genre: "text", tags: "text" });

module.exports = mongoose.model("Content", contentSchema);
