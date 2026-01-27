import mongoose, { Schema, Document } from 'mongoose';

export interface IClaim extends Document {
  userId: mongoose.Types.ObjectId;
  dealId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  claimedAt: Date;
  approvedAt?: Date;
  code?: string;
  createdAt: Date;
  updatedAt: Date;
}

const claimSchema = new Schema<IClaim>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dealId: {
      type: Schema.Types.ObjectId,
      ref: 'Deal',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending',
      index: true,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user-deal combination to ensure one claim per user per deal
claimSchema.index({ userId: 1, dealId: 1 }, { unique: true });
claimSchema.index({ status: 1, createdAt: -1 });
claimSchema.index({ dealId: 1, status: 1 });

export const Claim = mongoose.model<IClaim>('Claim', claimSchema);
