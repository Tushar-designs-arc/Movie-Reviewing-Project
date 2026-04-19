const express = require("express");
const mongoose = require("mongoose");
const Content = require("../models/Content");
const Favorite = require("../models/Favorite");
const Watchlist = require("../models/Watchlist");
const ContinueWatching = require("../models/ContinueWatching");
const { isMongoReady } = require("../config/database");
const { findContent, populateContentList, state } = require("../data/memoryStore");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { serializeContent } = require("./contentRoutes");

const router = express.Router();

const resolveMongoContent = async (identifier) => {
  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { $or: [{ _id: identifier }, { slug: identifier }] }
    : { slug: identifier };

  return Content.findOne(query).lean();
};

const getUserId = (req) => String(req.user._id);

const getModelByCollection = (collection) =>
  collection === "favorites" ? Favorite : collection === "watchlist" ? Watchlist : null;

const getMemoryCollection = (collection) =>
  collection === "favorites" ? state.favorites : state.watchlist;

const listCollection = async (req, res, collection) => {
  if (isMongoReady()) {
    const Model = getModelByCollection(collection);
    const records = await Model.find({ user: req.user._id })
      .populate("content")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      data: records
        .filter((record) => record.content)
        .map((record) => ({ ...record, content: serializeContent(record.content) })),
    });
  }

  const records = populateContentList(
    getMemoryCollection(collection)
      .filter((record) => record.user === getUserId(req))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  );

  return res.json({
    data: records.map((record) => ({ ...record, content: serializeContent(record.content) })),
  });
};

const addToCollection = async (req, res, collection) => {
  const contentId = req.body.contentId || req.body.content;

  if (!contentId) {
    return res.status(400).json({ message: "contentId is required." });
  }

  if (isMongoReady()) {
    const content = await resolveMongoContent(contentId);

    if (!content) {
      return res.status(404).json({ message: "Content not found." });
    }

    const Model = getModelByCollection(collection);
    const record = await Model.findOneAndUpdate(
      { user: req.user._id, content: content._id },
      { user: req.user._id, content: content._id },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
      .populate("content")
      .lean();

    return res.status(201).json({ item: { ...record, content: serializeContent(record.content) } });
  }

  const content = findContent(contentId);

  if (!content) {
    return res.status(404).json({ message: "Content not found." });
  }

  const items = getMemoryCollection(collection);
  let record = items.find((item) => item.user === getUserId(req) && item.content === content._id);

  if (!record) {
    record = {
      _id: `${collection}-${getUserId(req)}-${content._id}`,
      user: getUserId(req),
      content: content._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(record);
  }

  return res.status(201).json({ item: { ...record, content: serializeContent(content) } });
};

const removeFromCollection = async (req, res, collection) => {
  if (isMongoReady()) {
    const content = await resolveMongoContent(req.params.contentId);

    if (!content) {
      return res.status(404).json({ message: "Content not found." });
    }

    const Model = getModelByCollection(collection);
    await Model.findOneAndDelete({ user: req.user._id, content: content._id });
    return res.json({ message: "Removed." });
  }

  const content = findContent(req.params.contentId);

  if (!content) {
    return res.status(404).json({ message: "Content not found." });
  }

  const items = getMemoryCollection(collection);
  const index = items.findIndex(
    (item) => item.user === getUserId(req) && item.content === content._id,
  );

  if (index >= 0) {
    items.splice(index, 1);
  }

  return res.json({ message: "Removed." });
};

router.get("/watchlist", protect, asyncHandler((req, res) => listCollection(req, res, "watchlist")));
router.post("/watchlist", protect, asyncHandler((req, res) => addToCollection(req, res, "watchlist")));
router.delete(
  "/watchlist/:contentId",
  protect,
  asyncHandler((req, res) => removeFromCollection(req, res, "watchlist")),
);

router.get("/favorites", protect, asyncHandler((req, res) => listCollection(req, res, "favorites")));
router.post("/favorites", protect, asyncHandler((req, res) => addToCollection(req, res, "favorites")));
router.delete(
  "/favorites/:contentId",
  protect,
  asyncHandler((req, res) => removeFromCollection(req, res, "favorites")),
);

router.get(
  "/continue-watching",
  protect,
  asyncHandler(async (req, res) => {
    if (isMongoReady()) {
      const records = await ContinueWatching.find({ user: req.user._id })
        .populate("content")
        .sort({ lastWatchedAt: -1 })
        .lean();

      return res.json({
        data: records
          .filter((record) => record.content)
          .map((record) => ({ ...record, content: serializeContent(record.content) })),
      });
    }

    const records = populateContentList(
      state.continueWatching
        .filter((record) => record.user === getUserId(req))
        .sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)),
    );

    return res.json({
      data: records.map((record) => ({ ...record, content: serializeContent(record.content) })),
    });
  }),
);

router.post(
  "/continue-watching",
  protect,
  asyncHandler(async (req, res) => {
    const contentId = req.body.contentId || req.body.content;
    const progress = Math.min(Math.max(Number(req.body.progress) || 0, 0), 100);
    const duration = Math.max(Number(req.body.duration) || 0, 0);

    if (!contentId) {
      return res.status(400).json({ message: "contentId is required." });
    }

    if (isMongoReady()) {
      const content = await resolveMongoContent(contentId);

      if (!content) {
        return res.status(404).json({ message: "Content not found." });
      }

      const record = await ContinueWatching.findOneAndUpdate(
        { user: req.user._id, content: content._id },
        { progress, duration, lastWatchedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
        .populate("content")
        .lean();

      return res.status(201).json({ item: { ...record, content: serializeContent(record.content) } });
    }

    const content = findContent(contentId);

    if (!content) {
      return res.status(404).json({ message: "Content not found." });
    }

    let record = state.continueWatching.find(
      (item) => item.user === getUserId(req) && item.content === content._id,
    );

    if (!record) {
      record = {
        _id: `continue-${getUserId(req)}-${content._id}`,
        user: getUserId(req),
        content: content._id,
        createdAt: new Date().toISOString(),
      };
      state.continueWatching.push(record);
    }

    record.progress = progress;
    record.duration = duration;
    record.lastWatchedAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();

    return res.status(201).json({ item: { ...record, content: serializeContent(content) } });
  }),
);

router.delete(
  "/continue-watching/:contentId",
  protect,
  asyncHandler(async (req, res) => {
    if (isMongoReady()) {
      const content = await resolveMongoContent(req.params.contentId);

      if (!content) {
        return res.status(404).json({ message: "Content not found." });
      }

      await ContinueWatching.findOneAndDelete({ user: req.user._id, content: content._id });
      return res.json({ message: "Removed." });
    }

    const content = findContent(req.params.contentId);

    if (!content) {
      return res.status(404).json({ message: "Content not found." });
    }

    const index = state.continueWatching.findIndex(
      (item) => item.user === getUserId(req) && item.content === content._id,
    );

    if (index >= 0) {
      state.continueWatching.splice(index, 1);
    }

    return res.json({ message: "Removed." });
  }),
);

module.exports = router;
