const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { contentRouter, getAllContent, serializeContent } = require("./routes/contentRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { isMongoReady } = require("./config/database");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed."));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    message: "OTT backend is running.",
    database: isMongoReady() ? "mongodb" : "memory",
  });
});

app.get("/api/storefront", async (_req, res, next) => {
  try {
    const allContent = (await getAllContent()).map(serializeContent);

    res.json({
      hero: allContent.filter((item) => item.isTrending).slice(0, 5),
      trending: allContent.filter((item) => item.isTrending).slice(0, 12),
      popularWebSeries: allContent
        .filter((item) => item.type === "webseries" && item.isPopular)
        .slice(0, 12),
      tvShows: allContent.filter((item) => item.type === "show").slice(0, 12),
      serials: allContent.filter((item) => item.type === "serial").slice(0, 12),
      recentlyAdded: allContent.filter((item) => item.isRecentlyAdded).slice(0, 12),
      allContent,
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/user", libraryRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/movies", async (_req, res, next) => {
  try {
    const movies = (await getAllContent())
      .filter((content) => content.type === "movie")
      .map(serializeContent);
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
