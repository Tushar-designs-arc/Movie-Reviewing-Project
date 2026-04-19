const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign(
    {
      id: String(user._id),
      role: user.role || "user",
    },
    process.env.JWT_SECRET || "dev_only_change_me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

module.exports = {
  signToken,
};
