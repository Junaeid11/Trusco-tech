import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { IProduct } from '@/types';

export interface ProductDocument extends Omit<IProduct, '_id'>, Document {
  updateRating(): Promise<void>;
}

interface ProductModel extends mongoose.Model<ProductDocument> {
  findBySlug(slug: string): Promise<ProductDocument | null>;
  getActiveProducts(filters?: any, page?: number, limit?: number): Promise<ProductDocument[]>;
  getRelatedProducts(productId: string, categoryIds: string[], limit?: number): Promise<ProductDocument[]>;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    sku: {
      type: String,
      unique: true,
      required: [true, 'SKU is required'],
      uppercase: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand is required'],
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'At least one category is required'],
    }],
 
    images: [{
      type: String,
      trim: true,
    }],
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      enum: ['BDT', 'USD'],
      default: 'USD',
    },
    discount: {
      type: {
        type: String,
        enum: ['flat', 'percent'],
      },
      value: {
        type: Number,
        min: 0,
      },
      start: Date,
      end: Date,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    attributes: {
      type: Map,
      of: Schema.Types.Mixed,
      default: new Map(),
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot be more than 200 characters'],
    },
    descriptionHtml: {
      type: String,
      required: [true, 'Product description is required'],
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    warranty: String,
    emi: {
      enabled: {
        type: Boolean,
        default: false,
      },
      months: [{
        type: Number,
        min: 3,
        max: 36,
      }],
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
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratingAvg: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: 'text', shortDescription: 'text' });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();

  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// Static method to find by slug
productSchema.statics['findBySlug'] = function(slug: string) {
  return this.findOne({ slug, isActive: true })
    .populate('brand', 'name logo')
    .populate('categories', 'name slug');
};

// Static method to get active products with filters
productSchema.statics['getActiveProducts'] = function(filters: any = {}, page: number = 1, limit: number = 10) {
  const query: any = { isActive: true };
  const skip = (page - 1) * limit;

  // Text search
  if (filters.q) {
    query.$text = { $search: filters.q };
  }

  // Category filter
  if (filters.category) {
    query.categories = filters.category;
  }

  // Brand filter
  if (filters.brand) {
    query.brand = filters.brand;
  }

  // Price range
  if (filters.price) {
    if (filters.price.min !== undefined) {
      query.price = { $gte: filters.price.min };
    }
    if (filters.price.max !== undefined) {
      query.price = { ...query.price, $lte: filters.price.max };
    }
  }

  // Rating filter
  if (filters.rating && filters.rating.min) {
    query.ratingAvg = { $gte: filters.rating.min };
  }

  // Stock filter
  if (filters.inStock) {
    query.stock = { $gt: 0 };
  }

  // Attributes filter
  if (filters.attributes) {
    Object.keys(filters.attributes).forEach(key => {
      query[`attributes.${key}`] = filters.attributes[key];
    });
  }

  // Sort options
  let sort: any = { createdAt: -1 };
  if (filters.sort) {
    if (filters.sort === '-price') sort = { price: -1 };
    else if (filters.sort === 'price') sort = { price: 1 };
    else if (filters.sort === 'rating') sort = { ratingAvg: -1 };
    else if (filters.sort === '-rating') sort = { ratingAvg: 1 };
  }

  return this.find(query)
    .populate('brand', 'name logo')
    .populate('categories', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to get related products
productSchema.statics['getRelatedProducts'] = function(productId: string, categoryIds: string[], limit: number = 6) {
  return this.find({
    _id: { $ne: productId },
    categories: { $in: categoryIds },
    isActive: true,
  })
    .populate('brand', 'name logo')
    .populate('categories', 'name slug')
    .limit(limit);
};

// Instance method to update rating
productSchema.methods['updateRating'] = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { product: this['_id'], status: 'visible' } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    this['ratingAvg'] = Math.round(stats[0].avgRating * 10) / 10;
    this['ratingCount'] = stats[0].count;
  } else {
    this['ratingAvg'] = 0;
    this['ratingCount'] = 0;
  }

  await this['save']();
};

export const Product = mongoose.model<ProductDocument, ProductModel>('Product', productSchema);
