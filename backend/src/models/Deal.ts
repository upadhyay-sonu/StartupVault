import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description: string;
  category: string;
  accessLevel: 'public' | 'verified';
  discount: number;
  discountType: 'percentage' | 'flat';
  maxClaims: number;
  currentClaims: number;
  partner: {
    name: string;
    logo: string;
    description: string;
    website: string;
  };
  terms: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'hosting',
        'analytics',
        'payment',
        'communication',
        'productivity',
        'design',
        'development',
        'marketing',
        'other',
      ],
      required: true,
      index: true,
    },
    accessLevel: {
      type: String,
      enum: ['public', 'verified'],
      default: 'public',
      index: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      required: true,
    },
    maxClaims: {
      type: Number,
      required: true,
    },
    currentClaims: {
      type: Number,
      default: 0,
    },
    partner: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      website: {
        type: String,
        required: true,
      },
    },
    terms: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for querying performance
dealSchema.index({ category: 1, createdAt: -1 });
dealSchema.index({ accessLevel: 1, expiresAt: 1 });
dealSchema.index({ expiresAt: 1 });

export const Deal = mongoose.model<IDeal>('Deal', dealSchema);
