import { getDb } from '../config/db.js';

// @desc    Get all approved components
// @route   GET /api/components
export const getComponents = async (req, res) => {
  try {
    const { Component } = getDb();
    const components = await Component.find({ status: 'approved' }).populate('submittedBy', 'name');
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single component by ID
// @route   GET /api/components/:id
export const getComponentById = async (req, res) => {
  try {
    const { Component } = getDb();
    const component = await Component.findById(req.params.id).populate('submittedBy', 'name');
    if (!component) return res.status(404).json({ message: 'Component not found' });
    // If it's pending, only admin or creator should see it, but for simplicity we'll just return it.
    res.json(component);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Create a component
//          Admin  → free or premium, auto-approved
//          User   → forced free, goes to pending review
// @route   POST /api/components
export const createComponent = async (req, res) => {
  try {
    const { Component } = getDb();
    const { name, category, description, code, isFree, credits } = req.body;
    const isAdmin = req.session.role === 'admin';

    const component = await Component.create({
      name,
      category,
      description,
      code,
      isFree:      isAdmin ? isFree : true,
      credits:     isAdmin && !isFree ? credits : 0,
      source:      isAdmin ? 'admin' : 'community',
      status:      isAdmin ? 'approved' : 'pending',
      submittedBy: req.session.userId,
      rating:      5.0,
      downloads:   0,
    });

    res.status(201).json(component);
  } catch (err) {
    res.status(400).json({ message: 'Invalid component data', error: err.message });
  }
};

// @desc    Get all pending (admin review queue)
// @route   GET /api/components/pending
export const getPendingComponents = async (req, res) => {
  try {
    const { Component } = getDb();
    const components = await Component.find({ status: 'pending' }).populate('submittedBy', 'name email');
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve a pending component
// @route   PUT /api/components/:id/approve
export const approveComponent = async (req, res) => {
  try {
    const { Component } = getDb();
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ message: 'Component not found' });
    component.status = 'approved';
    await component.save();
    res.json(component);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a component
// @route   DELETE /api/components/:id
export const deleteComponent = async (req, res) => {
  try {
    const { Component } = getDb();
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ message: 'Component not found' });
    
    await component.deleteOne();
    res.json({ message: 'Component removed' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a component
// @route   PUT /api/components/:id
export const updateComponent = async (req, res) => {
  try {
    const { Component } = getDb();
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ message: 'Component not found' });

    const { name, category, description, code, isFree, credits, status } = req.body;

    if (name !== undefined) component.name = name;
    if (category !== undefined) component.category = category;
    if (description !== undefined) component.description = description;
    if (code !== undefined) component.code = code;
    if (isFree !== undefined) component.isFree = isFree;
    if (credits !== undefined) component.credits = credits;
    if (status !== undefined) component.status = status;

    const updatedComponent = await component.save();
    res.json(updatedComponent);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
