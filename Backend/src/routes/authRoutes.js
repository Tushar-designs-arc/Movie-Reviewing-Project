const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isMongoReady } = require("../config/database");
const { protect } = require("../middleware/authMiddleware");
const { sanitizeUser, state } = require("../data/memoryStore");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/tokens");

const router = express.Router();

const authResponse = (user) => ({
  user: sanitizeUser(user),
  token: signToken(user),
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoReady()) {
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return res.status(409).json({ message: "Email is already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        avatar,
      });

      return res.status(201).json(authResponse(user.toObject()));
    }

    const existingUser = state.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const user = {
      _id: `user-${Date.now()}`,
      name,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      avatar: avatar || "",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.users.push(user);
    return res.status(201).json(authResponse(user));
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user;

    if (isMongoReady()) {
      user = await User.findOne({ email: normalizedEmail }).select("+password").lean();
    } else {
      user = state.users.find((item) => item.email === normalizedEmail);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json(authResponse(user));
  }),
);

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
