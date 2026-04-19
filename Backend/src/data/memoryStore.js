const bcrypt = require("bcryptjs");
const { categories, contents } = require("./seedData");

const now = () => new Date().toISOString();

const state = {
  users: [],
  categories: categories.map((category) => ({
    ...category,
    _id: category.slug,
    createdAt: now(),
    updatedAt: now(),
  })),
  contents: contents.map((content) => ({
    ...content,
    _id: content.slug,
    createdAt: now(),
    updatedAt: now(),
  })),
  watchlist: [],
  favorites: [],
  continueWatching: [],
};

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
};

const initializeMemoryStore = async () => {
  if (state.users.length > 0) {
    return;
  }

  const [demoPassword, adminPassword] = await Promise.all([
    bcrypt.hash("password123", 10),
    bcrypt.hash("admin123", 10),
  ]);

  state.users.push(
    {
      _id: "user-demo",
      name: "Demo Viewer",
      email: "demo@ott.local",
      password: demoPassword,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      role: "user",
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "user-admin",
      name: "Admin User",
      email: "admin@ott.local",
      password: adminPassword,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "admin",
      createdAt: now(),
      updatedAt: now(),
    },
  );

  state.continueWatching.push(
    {
      _id: "cw-demo-1",
      user: "user-demo",
      content: "midnight-mumbai",
      progress: 62,
      duration: 2880,
      lastWatchedAt: now(),
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "cw-demo-2",
      user: "user-demo",
      content: "dune-part-two",
      progress: 34,
      duration: 9960,
      lastWatchedAt: now(),
      createdAt: now(),
      updatedAt: now(),
    },
  );
};

const findContent = (id) =>
  state.contents.find((content) => content._id === id || content.slug === id);

const findCategory = (id) =>
  state.categories.find((category) => category._id === id || category.slug === id);

const populateContentList = (records) =>
  records
    .map((record) => ({
      ...record,
      content: findContent(record.content),
    }))
    .filter((record) => record.content);

module.exports = {
  state,
  initializeMemoryStore,
  sanitizeUser,
  findContent,
  findCategory,
  populateContentList,
};
