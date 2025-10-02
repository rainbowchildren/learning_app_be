export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.role || !allowedRoles.includes(req.role)) {
        return res.status(403).json({
          message: `Access denied for role: ${req.role || "unknown"}`,
        });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};
