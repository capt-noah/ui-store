import { getDb } from '../config/db.js';

// @desc    Unlock a component (purchase)
// @route   POST /api/purchases
export const purchaseComponent = async (req, res) => {
  try {
    const { User, Component, Purchase } = getDb();
    const { componentId } = req.body;

    const component = await Component.findById(componentId);
    if (!component) return res.status(404).json({ message: 'Component not found' });

    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ user: user._id, component: component._id });
    if (existingPurchase) {
      return res.status(400).json({ message: 'You have already unlocked this component' });
    }

    if (!component.isFree) {
      if (user.credits < component.credits) {
        return res.status(400).json({ message: 'Insufficient credits' });
      }
      user.credits -= component.credits;
      await user.save();
    }

    const purchase = await Purchase.create({
      user: user._id,
      component: component._id,
      creditsSpent: component.isFree ? 0 : component.credits,
    });

    // Optionally increment downloads
    component.downloads += 1;
    await component.save();

    res.status(201).json({ message: 'Component unlocked successfully', purchase, remainingCredits: user.credits });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Get all components purchased by logged-in user
// @route   GET /api/purchases/me
export const getMyPurchases = async (req, res) => {
  try {
    const { Purchase } = getDb();
    const purchases = await Purchase.find({ user: req.session.userId })
      .populate('component', 'name category description isFree credits')
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Remove a component from library (un-bookmark)
// @route   DELETE /api/purchases/:componentId
export const removeFromLibrary = async (req, res) => {
  try {
    const { Purchase } = getDb();
    const result = await Purchase.findOneAndDelete({
      user: req.session.userId,
      component: req.params.componentId,
    });
    if (!result) return res.status(404).json({ message: 'Purchase not found' });
    res.json({ message: 'Removed from library' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
