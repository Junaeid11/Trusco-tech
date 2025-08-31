import { Request } from 'express';
import { Types } from 'mongoose';

// Base interfaces
export interface BaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface IUser extends BaseDocument {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string; // Optional for Google OAuth users
  role: 'customer' | 'admin';
  // Google OAuth fields
  googleId?: string;
  avatar?: string;
  isEmailVerified: boolean;
  // Password reset fields
  resetPasswordCode?: string;
  resetPasswordExpiry?: Date;
  addresses: IAddress[];
  wishlist: Types.ObjectId[];
  isActive: boolean;
}

export interface IAddress {
  type: 'home' | 'office' | 'other';
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Product types
export interface IProduct extends BaseDocument {
  name: string;
  slug: string;
  sku: string;
  brand: Types.ObjectId;
  categories: Types.ObjectId[];
  thumbnail: string;
  images: string[];
  price: number;
  currency: 'BDT' | 'USD';
  discount?: {
    type: 'flat' | 'percent';
    value: number;
    start?: Date;
    end?: Date;
  };
  stock: number;
  attributes: Map<string, string | number>;
  shortDescription: string;
  descriptionHtml: string;
  ratingAvg: number;
  ratingCount: number;
  warranty?: string;
  emi?: {
    enabled: boolean;
    months: number[];
  };
  isActive: boolean;
}

// Category types
export interface ICategory extends BaseDocument {
  name: string;
  slug: string;
  parent?: Types.ObjectId;
  path: string[];
  isActive: boolean;
  sort: number;
}

// Brand types
export interface IBrand extends BaseDocument {
  name: string;
  slug: string;
  logo?: string;
  isActive: boolean;
}

// Review types
export interface IReview extends BaseDocument {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  body: string;
  photos?: string[];
  status: 'visible' | 'hidden';
}

// Coupon types
export interface ICoupon extends BaseDocument {
  code: string;
  type: 'flat' | 'percent';
  value: number;
  minSubtotal?: number;
  maxDiscount?: number;
  start: Date;
  end: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

// Order types
export interface IOrder extends BaseDocument {
  user: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  grandTotal: number;
  currency: 'BDT' | 'USD';
  address: IAddress;
  status: OrderStatus;
  payment: IPayment;
  history: IOrderHistory[];
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  qty: number;
  thumbnail: string;
  total: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface IPayment {
  provider: 'stripe' | 'sslcommerz';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  trxId?: string;
  intentId?: string;
}

export interface IOrderHistory {
  at: Date;
  status: OrderStatus;
  note?: string;
}

// Cart types
export interface ICart extends BaseDocument {
  user: Types.ObjectId;
  items: ICartItem[];
  total: number;
}

export interface ICartItem {
  product: Types.ObjectId;
  qty: number;
}

// Wishlist types
export interface IWishlist extends BaseDocument {
  user: Types.ObjectId;
  products: Types.ObjectId[];
}

// Banner types
export interface IBanner extends BaseDocument {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  sort: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Request types
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Filter types
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

// JWT payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
