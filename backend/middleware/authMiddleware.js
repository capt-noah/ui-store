// Middleware to check if user is authenticated via session
export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated. Please log in.' });
  }
  next();
};

// Middleware to check if the user is an admin
export const requireAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated. Please log in.' });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};
