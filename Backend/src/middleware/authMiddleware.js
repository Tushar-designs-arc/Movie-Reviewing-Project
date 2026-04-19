const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isMongoReady } = require("../config/database");
const { sanitizeUser, state } = require("../data/memoryStore");

const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_only_change_me");
    let user;

    if (isMongoReady()) {
      user = await User.findById(decoded.id).select("-password");
    } else {
      user = sanitizeUser(state.users.find((item) => item._id === decoded.id));
    }

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  return next();
};

module.exports = {
  protect,
  requireAdmin,
};
