import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { IBrand } from '@/types';

export interface BrandDocument extends Omit<IBrand, '_id'>, Document {}

const brandSchema = new Schema<BrandDocument>(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      maxlength: [50, 'Brand name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
brandSchema.index({ slug: 1 });
brandSchema.index({ name: 1 });
brandSchema.index({ isActive: 1 });

// Pre-save middleware to generate slug
brandSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();

  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// Define static methods interface
interface BrandModel extends mongoose.Model<BrandDocument> {
  findBySlug(slug: string): Promise<BrandDocument | null>;
  getActive(): Promise<BrandDocument[]>;
}

// Static method to find by slug
brandSchema.statics['findBySlug'] = function(slug: string) {
  return this.findOne({ slug, isActive: true });
};

// Static method to get active brands
brandSchema.statics['getActive'] = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

export const Brand = mongoose.model<BrandDocument, BrandModel>('Brand', brandSchema);
