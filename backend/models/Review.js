import mongoose from 'mongoose';

/**
 * Review — user ratings and comments on components.
 * Drives the rating field shown on each ComponentCard in the Marketplace.
 */
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Component',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// One review per user per component
reviewSchema.index({ user: 1, component: 1 }, { unique: true });

/**
 * After saving a review, recalculate the component's average rating
 * and update the Component document.
 */
reviewSchema.post('save', async function () {
  const Review = this.constructor;
  const Component = mongoose.model('Component');

  const stats = await Review.aggregate([
    { $match: { component: this.component } },
    { $group: { _id: '$component', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Component.findByIdAndUpdate(this.component, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
