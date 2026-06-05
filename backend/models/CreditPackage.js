import mongoose from 'mongoose';

/**
 * CreditPackage — the pricing tiers displayed on the Pricing page.
 * Admins can create / update packages from the Admin Dashboard.
 */
const creditPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
      // e.g. "Starter", "Pro", "Team"
    },
    description: {
      type: String,
      default: '',
    },
    credits: {
      type: Number,
      required: [true, 'Credits amount is required'],
      min: [1, 'Must include at least 1 credit'],
    },
    priceUSD: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    isPopular: {
      // Highlighted on the Pricing page
      type: Boolean,
      default: false,
    },
    isActive: {
      // Admins can deactivate a package without deleting it
      type: Boolean,
      default: true,
    },
    sortOrder: {
      // Controls display order on the Pricing page
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CreditPackage = mongoose.model('CreditPackage', creditPackageSchema);
export default CreditPackage;
