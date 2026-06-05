import mongoose from 'mongoose';

/**
 * Purchase — records every component a user unlocks with credits.
 * Used to gate access on the ComponentDetail page and track downloads.
 */
const purchaseSchema = new mongoose.Schema(
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
    // Credits spent (snapshot — component price could change later)
    creditsSpent: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// A user can only purchase a given component once
purchaseSchema.index({ user: 1, component: 1 }, { unique: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
