import { getDb } from '../config/db.js';

// @desc    Simulate buying a credit package
// @route   POST /api/transactions
export const buyCredits = async (req, res) => {
  try {
    const { User } = getDb();
    const { credits } = req.body;

    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.credits = (user.credits || 0) + Number(credits || 0);
    await user.save();

    res.status(201).json({ message: 'Credits purchased successfully', newBalance: user.credits });
  } catch (err) {
    console.error('TRANSACTION ERROR:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


