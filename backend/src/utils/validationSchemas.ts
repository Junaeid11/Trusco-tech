
import { z } from 'zod';

// Common schemas
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export const paginationQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('20'),
  sort: z.string().optional(),
  fields: z.string().optional(),
});

// Auth schemas
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().regex(/^(\+880|880|0)?1[3456789]\d{8}$/, 'Invalid phone number').optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// User schemas
export const updateUserSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    phone: z.string().regex(/^(\+880|880|0)?1[3456789]\d{8}$/).optional(),
    role: z.enum(['customer', 'admin']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const addressSchema = z.object({
  type: z.enum(['home', 'office', 'other']),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^(\+880|880|0)?1[3456789]\d{8}$/, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

export const addAddressSchema = z.object({
  body: addressSchema,
});

// Category schemas
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Category name cannot exceed 50 characters'),
    parent: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    sort: z.number().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    parent: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    sort: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Brand schemas
export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Brand name is required').max(50, 'Brand name cannot exceed 50 characters'),
    logo: z.string().url('Invalid logo URL').optional(),
  }),
});

export const updateBrandSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    logo: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Product schemas
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').max(200, 'Product name cannot exceed 200 characters'),
    sku: z.string().min(1, 'SKU is required').max(50, 'SKU cannot exceed 50 characters'),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID'),
    categories: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1, 'At least one category is required'),
    thumbnail: z.string().url('Invalid thumbnail URL'),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    price: z.number().min(0, 'Price cannot be negative'),
    currency: z.enum(['BDT', 'USD']).optional(),
    discount: z.object({
      type: z.enum(['flat', 'percent']),
      value: z.number().min(0),
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    }).optional(),
    stock: z.number().min(0, 'Stock cannot be negative'),
    attributes: z.record(z.union([z.string(), z.number()])).optional(),
    shortDescription: z.string().min(1, 'Short description is required').max(500, 'Short description cannot exceed 500 characters'),
    descriptionHtml: z.string().min(1, 'Description is required'),
    warranty: z.string().optional(),
    emi: z.object({
      enabled: z.boolean(),
      months: z.array(z.number().min(3).max(36)),
    }).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    sku: z.string().min(1).max(50).optional(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    categories: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    thumbnail: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    price: z.number().min(0).optional(),
    currency: z.enum(['BDT', 'USD']).optional(),
    discount: z.object({
      type: z.enum(['flat', 'percent']),
      value: z.number().min(0),
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    }).optional(),
    stock: z.number().min(0).optional(),
    attributes: z.record(z.union([z.string(), z.number()])).optional(),
    shortDescription: z.string().min(1).max(500).optional(),
    descriptionHtml: z.string().min(1).optional(),
    warranty: z.string().optional(),
    emi: z.object({
      enabled: z.boolean(),
      months: z.array(z.number().min(3).max(36)),
    }).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const productFiltersSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    'price[min]': z.string().transform(Number).pipe(z.number().min(0)).optional(),
    'price[max]': z.string().transform(Number).pipe(z.number().min(0)).optional(),
    'rating[min]': z.string().transform(Number).pipe(z.number().min(1).max(5)).optional(),
    inStock: z.string().transform(val => val === 'true').optional(),
    sort: z.string().optional(),
    page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('20'),
    fields: z.string().optional(),
  }),
});

// Review schemas
export const createReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
  body: z.object({
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    title: z.string().max(100, 'Title cannot exceed 100 characters').optional(),
    body: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review cannot exceed 1000 characters'),
    photos: z.array(z.string().url('Invalid photo URL')).optional(),
  }),
});

export const updateReviewSchema = z.object({
  params: idParamSchema,
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    title: z.string().max(100).optional(),
    body: z.string().min(10).max(1000).optional(),
    photos: z.array(z.string().url()).optional(),
    status: z.enum(['visible', 'hidden']).optional(),
  }),
});

// Cart schemas
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    qty: z.number().min(1, 'Quantity must be at least 1'),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
  body: z.object({
    qty: z.number().min(1, 'Quantity must be at least 1'),
  }),
});

// Wishlist schemas
export const addToWishlistSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

// Coupon schemas
export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    subtotal: z.number().min(0, 'Subtotal cannot be negative'),
  }),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required').max(20, 'Coupon code cannot exceed 20 characters'),
    type: z.enum(['flat', 'percent']),
    value: z.number().min(0, 'Value cannot be negative'),
    minSubtotal: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    start: z.string().datetime('Invalid start date'),
    end: z.string().datetime('Invalid end date'),
    usageLimit: z.number().min(1).optional(),
  }),
});

// Order schemas
export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
      qty: z.number().min(1, 'Quantity must be at least 1'),
    })).min(1, 'At least one item is required'),
    address: addressSchema,
    couponCode: z.string().optional(),
    paymentMethod: z.enum(['stripe', 'sslcommerz']),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: idParamSchema,
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
    note: z.string().max(500).optional(),
  }),
});

// Payment schemas
export const createPaymentIntentSchema = z.object({
  body: z.object({
    amount: z.number().min(1, 'Amount must be at least 1'),
    currency: z.enum(['BDT', 'USD']).optional(),
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
  }),
});

// Upload schemas
export const presignUploadSchema = z.object({
  body: z.object({
    fileName: z.string().min(1, 'File name is required'),
    fileType: z.string().min(1, 'File type is required'),
    folder: z.string().optional(),
  }),
});
