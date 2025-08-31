import { Product, ProductDocument } from './product.model';
import { BadRequestError as AppError , NotFoundError } from '../../utils/errors';

export interface ProductFilters {
  q?: string;
  category?: string;
  brand?: string;
  price?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
  };
  inStock?: boolean;
  attributes?: Record<string, string | number>;
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
}

export interface ProductFacets {
  categories: Array<{ _id: string; count: number }>;
  brands: Array<{ _id: string; count: number }>;
  priceRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
}

export class ProductService {
  static async getProducts(filters: ProductFilters = {}) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 50); // Max 50 items per page
    
    const products = await Product.getActiveProducts(filters, page, limit);
    const total = await Product.countDocuments({ isActive: true });
    
    // Get facets for filtering
    const facets = await this.getFacets(filters);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      facets,
    };
  }
  
  static async getProductBySlug(slug: string): Promise<ProductDocument> {
    const product = await Product.findBySlug(slug);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }
  
  static async getProductById(id: string): Promise<ProductDocument> {
    const product = await Product.findById(id).populate('brand', 'name logo').populate('categories', 'name slug');
    if (!product || !product.isActive) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }
  
  static async getRelatedProducts(productId: string, limit: number = 6): Promise<ProductDocument[]> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    const categoryIds = product.categories.map(cat => cat.toString());
    return await Product.getRelatedProducts(productId, categoryIds, limit);
  }
  
  static async createProduct(productData: Partial<ProductDocument>): Promise<ProductDocument> {
    // Validate SKU uniqueness
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      throw new AppError('SKU already exists');
    }
  
    
    const product = new Product(productData);
    await product.save();
    
    return product.populate('brand', 'name logo').populate('categories', 'name slug');
  }
  
  static async updateProduct(id: string, updateData: Partial<ProductDocument>): Promise<ProductDocument> {
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    // Check SKU uniqueness if updating
    if (updateData.sku && updateData.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: updateData.sku });
      if (existingProduct) {
        throw new AppError('SKU already exists');
      }
    }
    
    Object.assign(product, updateData);
    await product.save();
    
    return product.populate('brand', 'name logo').populate('categories', 'name slug');
  }
  
  static async deleteProduct(id: string): Promise<void> {
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    // Soft delete
    product.isActive = false;
    await product.save();
  }
  
  private static async getFacets(filters: ProductFilters): Promise<ProductFacets> {
    const baseQuery: any = { isActive: true };
    
    // Apply same filters as main query
    if (filters.q) {
      baseQuery.$text = { $search: filters.q };
    }
    if (filters.category) {
      baseQuery.categories = filters.category;
    }
    if (filters.brand) {
      baseQuery.brand = filters.brand;
    }
    if (filters.price) {
      if (filters.price.min !== undefined) {
        baseQuery.price = { $gte: filters.price.min };
      }
      if (filters.price.max !== undefined) {
        baseQuery.price = { ...baseQuery.price, $lte: filters.price.max };
      }
    }
    if (filters.rating && filters.rating.min) {
      baseQuery.ratingAvg = { $gte: filters.rating.min };
    }
    if (filters.inStock) {
      baseQuery.stock = { $gt: 0 };
    }
    
    const [categories, brands, priceStats, ratingStats] = await Promise.all([
      Product.aggregate([
        { $match: baseQuery },
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
      Product.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
      Product.aggregate([
        { $match: baseQuery },
        { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
      ]),
      Product.aggregate([
        { $match: baseQuery },
        { $group: { _id: null, min: { $min: '$ratingAvg' }, max: { $max: '$ratingAvg' } } },
      ]),
    ]);
    
    return {
      categories,
      brands,
      priceRange: priceStats[0] ? { min: priceStats[0].min, max: priceStats[0].max } : { min: 0, max: 0 },
      ratingRange: ratingStats[0] ? { min: ratingStats[0].min, max: ratingStats[0].max } : { min: 0, max: 5 },
    };
  }
}
