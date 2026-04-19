const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["movie", "webseries", "show", "serial"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
