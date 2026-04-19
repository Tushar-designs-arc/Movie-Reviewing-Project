const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const Content = require("../models/Content");
const { isMongoReady } = require("../config/database");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { findContent, state } = require("../data/memoryStore");
const asyncHandler = require("../utils/asyncHandler");
const { getRecommendations } = require("../utils/recommendations");
const slugify = require("../utils/slugify");

const router = express.Router();
const demoVideoPath = path.resolve(
  __dirname,
  "../../../Frontend/public/Lookism_Fly_Up_Full_Song_Hindi_Cover.mp4",
);

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const serializeContent = (content) => {
  if (!content) {
    return null;
  }

  const item = content.toObject ? content.toObject() : content;
  const slug = item.slug || String(item._id);

  return {
    ...item,
    id: slug,
    videoUrl: item.videoUrl || `/api/content/${slug}/stream`,
  };
};

const getContentByIdentifier = async (identifier) => {
  if (isMongoReady()) {
    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { $or: [{ _id: identifier }, { slug: identifier }] }
      : { slug: identifier };

    return Content.findOne(query).lean();
  }

  return findContent(identifier);
};

const getAllContent = async () => {
  if (isMongoReady()) {
    return Content.find().sort({ createdAt: -1 }).lean();
  }

  return [...state.contents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const buildMemoryQuery = (query) => {
  const q = query.q || query.search || "";

  return state.contents.filter((content) => {
    const matchesType = query.type ? content.type === query.type : true;
    const matchesGenre = query.genre ? content.genre.includes(query.genre) : true;
    const matchesTrending = query.trending === "true" ? content.isTrending : true;
    const matchesPopular = query.popular === "true" ? content.isPopular : true;
    const matchesRecent = query.recent === "true" ? content.isRecentlyAdded : true;
    const haystack = [
      content.title,
      content.description,
      content.director,
      content.language,
      ...content.genre,
      ...content.tags,
      ...content.cast,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = q ? haystack.includes(q.toLowerCase()) : true;

    return (
      matchesType &&
      matchesGenre &&
      matchesTrending &&
      matchesPopular &&
      matchesRecent &&
      matchesSearch
    );
  });
};

const paginate = (items, page, limit) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 40);
  const start = (currentPage - 1) * pageSize;

  return {
    data: items.slice(start, start + pageSize).map(serializeContent),
    pagination: {
      page: currentPage,
      limit: pageSize,
      total: items.length,
      pages: Math.max(Math.ceil(items.length / pageSize), 1),
    },
  };
};

const streamVideo = (_req, res) => {
  if (!fs.existsSync(demoVideoPath)) {
    return res.status(404).json({ message: "Demo video file was not found." });
  }

  const fileSize = fs.statSync(demoVideoPath).size;
  const rangeHeader = _req.headers.range;

  if (!rangeHeader) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
    });
    return fs.createReadStream(demoVideoPath).pipe(res);
  }

  const [rawStart, rawEnd] = rangeHeader.replace("bytes=", "").split("-");
  const start = Number(rawStart);
  const end = rawEnd ? Number(rawEnd) : fileSize - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start >= fileSize || end >= fileSize) {
    res.status(416).setHeader("Content-Range", `bytes */${fileSize}`);
    return res.end();
  }

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4",
  });

  return fs.createReadStream(demoVideoPath, { start, end }).pipe(res);
};

const listContent = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 12,
      type,
      genre,
      q,
      search,
      trending,
      popular,
      recent,
      sort = "-createdAt",
    } = req.query;

    if (isMongoReady()) {
      const filters = {};
      const searchTerm = q || search;

      if (type) filters.type = type;
      if (genre) filters.genre = genre;
      if (trending === "true") filters.isTrending = true;
      if (popular === "true") filters.isPopular = true;
      if (recent === "true") filters.isRecentlyAdded = true;
      if (searchTerm) {
        const regex = new RegExp(escapeRegExp(searchTerm), "i");
        filters.$or = [
          { title: regex },
          { description: regex },
          { genre: regex },
          { tags: regex },
          { cast: regex },
          { director: regex },
        ];
      }

      const currentPage = Math.max(Number(page) || 1, 1);
      const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 40);
      const skip = (currentPage - 1) * pageSize;
      const [items, total] = await Promise.all([
        Content.find(filters).sort(sort).skip(skip).limit(pageSize).lean(),
        Content.countDocuments(filters),
      ]);

      return res.json({
        data: items.map(serializeContent),
        pagination: {
          page: currentPage,
          limit: pageSize,
          total,
          pages: Math.max(Math.ceil(total / pageSize), 1),
        },
      });
    }

    const filtered = buildMemoryQuery(req.query);
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "rating") return a.rating - b.rating;
      if (sort === "-rating") return b.rating - a.rating;
      if (sort === "releaseYear") return a.releaseYear - b.releaseYear;
      if (sort === "-releaseYear") return b.releaseYear - a.releaseYear;
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.json(paginate(sorted, page, limit));
});

router.get("/", listContent);
router.get("/search", listContent);

router.get(
  "/recommendations",
  asyncHandler(async (req, res) => {
    const allContent = await getAllContent();
    const featured = allContent.find((item) => item.isTrending) || allContent[0];
    res.json({
      data: getRecommendations(allContent, featured, req.query.limit).map(serializeContent),
    });
  }),
);

router.get(
  "/:id/recommendations",
  asyncHandler(async (req, res) => {
    const target = await getContentByIdentifier(req.params.id);

    if (!target) {
      return res.status(404).json({ message: "Content not found." });
    }

    const allContent = await getAllContent();
    return res.json({
      data: getRecommendations(allContent, target, req.query.limit).map(serializeContent),
    });
  }),
);

router.get(
  "/:id/stream",
  asyncHandler(async (req, res) => {
    const content = await getContentByIdentifier(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found." });
    }

    return streamVideo(req, res);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const content = await getContentByIdentifier(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found." });
    }

    const allContent = await getAllContent();

    return res.json({
      content: serializeContent(content),
      recommendations: getRecommendations(allContent, content, 8).map(serializeContent),
    });
  }),
);

router.post(
  "/",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const slug = req.body.slug || slugify(req.body.title);
    const payload = { ...req.body, slug };

    if (isMongoReady()) {
      const content = await Content.create(payload);
      return res.status(201).json({ content: serializeContent(content) });
    }

    if (state.contents.some((content) => content.slug === slug)) {
      return res.status(409).json({ message: "A content item with this slug already exists." });
    }

    const content = {
      ...payload,
      _id: slug,
      rating: Number(payload.rating) || 0,
      releaseYear: Number(payload.releaseYear) || new Date().getFullYear(),
      genre: Array.isArray(payload.genre) ? payload.genre : [],
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      cast: Array.isArray(payload.cast) ? payload.cast : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.contents.unshift(content);
    return res.status(201).json({ content: serializeContent(content) });
  }),
);

router.put(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (isMongoReady()) {
      const content = await Content.findOneAndUpdate(
        mongoose.Types.ObjectId.isValid(req.params.id)
          ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
          : { slug: req.params.id },
        req.body,
        { new: true, runValidators: true },
      ).lean();

      if (!content) {
        return res.status(404).json({ message: "Content not found." });
      }

      return res.json({ content: serializeContent(content) });
    }

    const index = state.contents.findIndex(
      (content) => content._id === req.params.id || content.slug === req.params.id,
    );

    if (index === -1) {
      return res.status(404).json({ message: "Content not found." });
    }

    state.contents[index] = {
      ...state.contents[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res.json({ content: serializeContent(state.contents[index]) });
  }),
);

router.delete(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (isMongoReady()) {
      const content = await Content.findOneAndDelete(
        mongoose.Types.ObjectId.isValid(req.params.id)
          ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
          : { slug: req.params.id },
      );

      if (!content) {
        return res.status(404).json({ message: "Content not found." });
      }

      return res.json({ message: "Content deleted." });
    }

    const index = state.contents.findIndex(
      (content) => content._id === req.params.id || content.slug === req.params.id,
    );

    if (index === -1) {
      return res.status(404).json({ message: "Content not found." });
    }

    state.contents.splice(index, 1);
    return res.json({ message: "Content deleted." });
  }),
);

module.exports = {
  contentRouter: router,
  serializeContent,
  getAllContent,
};
