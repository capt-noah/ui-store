import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Component name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    // The actual component source code (JSX / HTML / CSS)
    code: {
      type: String,
      required: [true, 'Component code is required'],
      default: '',
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    credits: {
      type: Number,
      default: 0,
      min: [0, 'Credits cannot be negative'],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    // 'pending' = awaiting admin approval (community submissions)
    // 'approved' = visible in Marketplace
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'approved',
    },
    // 'admin' = added by an admin | 'community' = submitted by a user
    source: {
      type: String,
      enum: ['admin', 'community'],
      default: 'admin',
    },
    // The user who submitted the component
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

const Component = mongoose.model('Component', componentSchema);
export default Component;
