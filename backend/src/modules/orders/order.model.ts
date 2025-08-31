import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, OrderStatus, IPayment } from '@/types';

export interface OrderDocument extends Omit<IOrder, '_id'>, Document {}

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
  },
  total: {
    type: Number,
    required: true,
  },
});

const addressSchema = new Schema({
  type: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'home',
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const paymentSchema = new Schema({
  provider: {
    type: String,
    enum: ['stripe', 'sslcommerz', 'cod'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  trxId: String,
  intentId: String,
});

const orderHistorySchema = new Schema({
  at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    required: true,
  },
  note: String,
});

const orderSchema = new Schema<OrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function() {
        return !this.isGuest;
      },
    },
    guest: {
      name: {
        type: String,
        required: function() {
          return this.isGuest;
        },
      },
      email: {
        type: String,
        required: function() {
          return this.isGuest;
        },
      },
      phone: {
        type: String,
        required: function() {
          return this.isGuest;
        },
      },
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    discountTotal: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['BDT', 'USD'],
      default: 'USD',
    },
    address: addressSchema,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    payment: paymentSchema,
    history: [orderHistorySchema],
    isGuest: {
      type: Boolean,
      default: false,
    },
    notes: String,
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ 'guest.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `${dateStr}-${randomStr}`;
  }
  next();
});

// Static method to find by order number
orderSchema.statics.findByOrderNumber = function(orderNumber: string) {
  return this.findOne({ orderNumber });
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get guest orders
orderSchema.statics.getGuestOrders = function(email: string, phone: string) {
  return this.find({
    $or: [
      { 'guest.email': email },
      { 'guest.phone': phone }
    ],
    isGuest: true
  }).sort({ createdAt: -1 });
};

export const Order = mongoose.model<OrderDocument>('Order', orderSchema);
