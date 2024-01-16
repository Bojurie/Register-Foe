export checkAdmin(req, res, next) {
  // Check if the user is an admin
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};
