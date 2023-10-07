// Middleware to check if the user is an admin
const isAdminCheckMiddleware = async (req, res, next) => {
  try {
    const user = req.payload;

    // Check if the user exists and is an admin
    if (user && user.isAdmin) {
      // User is an admin, proceed to the next middleware or route handler
      next();
    } else {
      // User is not an admin, return a 403 Forbidden status
      res
        .status(403)
        .json({ error: "Permission denied. User is not an admin." });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = isAdminCheckMiddleware;
