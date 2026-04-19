const bcrypt = require("bcryptjs");
const Category = require("../models/Category");
const Content = require("../models/Content");
const User = require("../models/User");
const { categories, contents } = require("./seedData");

const seedDatabase = async () => {
  const [contentCount, categoryCount, userCount] = await Promise.all([
    Content.countDocuments(),
    Category.countDocuments(),
    User.countDocuments(),
  ]);

  if (categoryCount === 0) {
    await Category.insertMany(categories);
  }

  if (contentCount === 0) {
    await Content.insertMany(contents);
  }

  if (userCount === 0) {
    const [demoPassword, adminPassword] = await Promise.all([
      bcrypt.hash("password123", 10),
      bcrypt.hash("admin123", 10),
    ]);

    await User.insertMany([
      {
        name: "Demo Viewer",
        email: "demo@ott.local",
        password: demoPassword,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        role: "user",
      },
      {
        name: "Admin User",
        email: "admin@ott.local",
        password: adminPassword,
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        role: "admin",
      },
    ]);
  }
};

module.exports = seedDatabase;
