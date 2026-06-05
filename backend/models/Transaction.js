import mongoose from 'mongoose';

/**
 * Transaction — records every credit purchase a user makes.
 * Created when a user successfully pays for a CreditPackage.
 */
const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creditPackage: {
      type: String, // String name of the package, e.g. "Starter"
      required: true,
    },
    credits: {
      // Credits granted in this transaction (snapshot in case package changes later)
      type: Number,
      required: true,
    },
    amountUSD: {
      // Amount paid (snapshot)
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    // Payment provider reference (Stripe charge ID, PayPal order ID, etc.)
    paymentReference: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
