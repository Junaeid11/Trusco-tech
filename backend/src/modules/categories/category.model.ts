import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { ICategory } from '@/types';

export interface CategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    path: [{
      type: String,
      required: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    sort: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ isActive: 1, sort: 1 });

// Pre-save middleware to generate slug and path
categorySchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();

  // Generate slug from name
  this.slug = slugify(this.name, { lower: true, strict: true });

  // Generate path
  if (this.parent) {
    const parentCategory = await this.constructor.findById(this.parent);
    if (parentCategory) {
      this.path = [...parentCategory.path, this.name];
    } else {
      this.path = [this.name];
    }
  } else {
    this.path = [this.name];
  }

  next();
});

// Static method to get category tree
categorySchema.statics.getTree = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $graphLookup: {
        from: 'categories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parent',
        as: 'children',
        restrictSearchWithMatch: { isActive: true }
      }
    },
    {
      $match: { parent: null }
    },
    {
      $sort: { sort: 1, name: 1 }
    }
  ]);
};

// Static method to get flat list
categorySchema.statics.getFlat = function() {
  return this.find({ isActive: true })
    .sort({ sort: 1, name: 1 })
    .populate('parent', 'name slug');
};

// Instance method to get all descendants
categorySchema.methods.getDescendants = function() {
  return this.constructor.find({
    path: { $regex: `^${this.path.join(' > ')}` },
    _id: { $ne: this._id }
  }).sort({ path: 1 });
};

// Instance method to get all ancestors
categorySchema.methods.getAncestors = function() {
  if (!this.parent) return [];
  
  return this.constructor.find({
    _id: { $in: this.path.slice(0, -1).map(name => 
      this.constructor.findOne({ name, path: { $regex: `^${name}` } })
    )}
  });
};

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema);
