const express = require("express");
const Content = require("../models/Content");
const Favorite = require("../models/Favorite");
const User = require("../models/User");
const Watchlist = require("../models/Watchlist");
const ContinueWatching = require("../models/ContinueWatching");
const { isMongoReady } = require("../config/database");
const { state } = require("../data/memoryStore");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    if (isMongoReady()) {
      const [users, content, watchlist, favorites, continueWatching, byType] = await Promise.all([
        User.countDocuments(),
        Content.countDocuments(),
        Watchlist.countDocuments(),
        Favorite.countDocuments(),
        ContinueWatching.countDocuments(),
        Content.aggregate([{ $group: { _id: "$type", total: { $sum: 1 } } }]),
      ]);

      return res.json({
        stats: { users, content, watchlist, favorites, continueWatching },
        byType,
      });
    }

    const byType = Object.entries(
      state.contents.reduce((acc, content) => {
        acc[content.type] = (acc[content.type] || 0) + 1;
        return acc;
      }, {}),
    ).map(([type, total]) => ({ _id: type, total }));

    return res.json({
      stats: {
        users: state.users.length,
        content: state.contents.length,
        watchlist: state.watchlist.length,
        favorites: state.favorites.length,
        continueWatching: state.continueWatching.length,
      },
      byType,
    });
  }),
);

module.exports = router;
