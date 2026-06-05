import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  console.log("=== REGISTER REQUEST START ===");
  console.log("Request body:", { ...req.body, password: '[REDACTED]' });
  try {
    const { User } = getDb();
    if (!User) {
      console.error("User model is undefined! getDb() failed to return User model.");
      return res.status(500).json({ message: 'Database misconfiguration' });
    }
    
    const { name, email, password } = req.body;
    console.log("Checking if user exists:", email);

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log("Creating new user...");
    const user = await User.create({ name, email, password, role: 'user', credits: 0 });
    console.log("User created successfully with ID:", user._id);

    req.session.userId = user._id.toString();
    req.session.role   = user.role;
    console.log("Session populated successfully");

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, credits: user.credits });
  } catch (err) {
    console.error("=== REGISTER ERROR CAUGHT ===");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    console.error("Full Error Object:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { User } = getDb();
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.userId = user._id.toString();
    req.session.role   = user.role;

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, credits: user.credits });
  } catch (err) {
    console.error("Auth Login Error:", err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Logout — destroy session and clear cookie
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('uistore.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

// @desc    Get current session user (returns null if not logged in — no 401)
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  // No session → return null gracefully so the client doesn't log a 401 on page load
  if (!req.session?.userId) {
    return res.json(null);
  }
  try {
    const { User } = getDb();
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.json(null);
    res.json(user);
  } catch (err) {
    console.error('Auth getMe Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
