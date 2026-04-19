const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const { isMongoReady } = require("../config/database");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { findCategory, state } = require("../data/memoryStore");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("../utils/slugify");

const router = express.Router();

const categoryQuery = (id) =>
  mongoose.Types.ObjectId.isValid(id) ? { $or: [{ slug: id }, { _id: id }] } : { slug: id };

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    if (isMongoReady()) {
      const categories = await Category.find().sort({ name: 1 }).lean();
      return res.json({ data: categories });
    }

    return res.json({ data: state.categories });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const category = isMongoReady()
      ? await Category.findOne(categoryQuery(req.params.id)).lean()
      : findCategory(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.json({ category });
  }),
);

router.post(
  "/",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      slug: req.body.slug || slugify(req.body.name),
    };

    if (isMongoReady()) {
      const category = await Category.create(payload);
      return res.status(201).json({ category });
    }

    if (state.categories.some((category) => category.slug === payload.slug)) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const category = {
      ...payload,
      _id: payload.slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.categories.push(category);
    return res.status(201).json({ category });
  }),
);

router.put(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (isMongoReady()) {
      const category = await Category.findOneAndUpdate(
        categoryQuery(req.params.id),
        req.body,
        { new: true, runValidators: true },
      ).lean();

      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }

      return res.json({ category });
    }

    const index = state.categories.findIndex(
      (category) => category._id === req.params.id || category.slug === req.params.id,
    );

    if (index === -1) {
      return res.status(404).json({ message: "Category not found." });
    }

    state.categories[index] = {
      ...state.categories[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res.json({ category: state.categories[index] });
  }),
);

router.delete(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (isMongoReady()) {
      const category = await Category.findOneAndDelete(categoryQuery(req.params.id));

      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }

      return res.json({ message: "Category deleted." });
    }

    const index = state.categories.findIndex(
      (category) => category._id === req.params.id || category.slug === req.params.id,
    );

    if (index === -1) {
      return res.status(404).json({ message: "Category not found." });
    }

    state.categories.splice(index, 1);
    return res.json({ message: "Category deleted." });
  }),
);

module.exports = router;
