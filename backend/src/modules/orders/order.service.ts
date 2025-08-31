import { Order, OrderDocument } from './order.model';
import { Product } from '../products/product.model';
// import { Coupon } from '../coupons/coupon.model';
import { mailer } from './../../utils/mailer';
import { BadRequestError, NotFoundError } from './../../utils/errors';
import { IAddress } from '@/types';

export interface GuestOrderData {
  name: string;
  phone: string;
  email: string;
  address: IAddress;
  items: Array<{
    productId: string;
    qty: number;
    price: number;
    name: string;
    thumbnail: string;
    variant?: string;
  }>;
  couponCode?: string;
  notes?: string;
}

export interface OrderResult {
  order: OrderDocument;
  orderId: string;
  orderNumber: string;
}

export class OrderService {
  static async createGuestCODOrder(orderData: GuestOrderData): Promise<OrderResult> {
    // Validate items and calculate totals
    const validatedItems = await this.validateAndCalculateItems(orderData.items);
    
    // Calculate subtotal
    const subtotal = validatedItems.reduce((sum, item) => sum + item.total, 0);
    
    // Apply coupon if provided
    let discountTotal = 0;
    let coupon = null;
    if (orderData.couponCode) {
      const couponResult = await this.applyCoupon(orderData.couponCode, subtotal);
      discountTotal = couponResult.discountAmount;
      coupon = couponResult.coupon;
    }
    
    // Calculate shipping fee (you can implement your own logic)
    const shippingFee = this.calculateShippingFee(subtotal);
    
    // Calculate grand total
    const grandTotal = subtotal - discountTotal + shippingFee;
    
    // Create order
    const order = new Order({
      guest: {
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
      },
      items: validatedItems,
      subtotal,
      discountTotal,
      shippingFee,
      grandTotal,
      address: orderData.address,
      payment: {
        provider: 'cod',
        status: 'pending',
      },
      status: 'pending',
      isGuest: true,
      notes: orderData.notes,
      coupon: coupon?._id,
      history: [{
        status: 'pending',
        note: 'Order created',
      }],
    });
    
    await order.save();
    
    // Send emails in background
    setImmediate(async () => {
      try {
        await mailer.sendOrderConfirmation(order, true);
        await mailer.sendAdminOrderNotification(order, true);
      } catch (error) {
        console.error('Failed to send order emails:', error);
      }
    });
    
    return {
      order,
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    };
  }
  
  static async createUserOrder(userId: string, orderData: {
    addressId: string;
    paymentProvider: 'stripe' | 'sslcommerz' | 'cod';
    couponCode?: string;
    notes?: string;
  }): Promise<OrderResult> {
    // This would integrate with cart service to get user's cart items
    // For now, returning a placeholder implementation
    throw new Error('User order creation not implemented yet');
  }
  
  static async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const orders = await Order.getUserOrders(userId, page, limit);
    const total = await Order.countDocuments({ user: userId });
    
    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
  
  static async getGuestOrders(email: string, phone: string) {
    return await Order.getGuestOrders(email, phone);
  }
  
  static async getOrderById(orderId: string, userId?: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Check if user has permission to view this order
    if (userId && order.user && order.user.toString() !== userId) {
      throw new BadRequestError('Access denied');
    }
    
    return order;
  }
  
  static async updateOrderStatus(orderId: string, status: string, note?: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    order.status = status;
    order.history.push({
      status,
      note: note || `Order status updated to ${status}`,
    });
    
    await order.save();
    return order;
  }
  
  private static async validateAndCalculateItems(items: GuestOrderData['items']) {
    const validatedItems = [];
    
    for (const item of items) {
      // Validate product exists and is active
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        throw new BadRequestError(`Product ${item.name} is not available`);
      }
      
      // Check stock (optional for guest orders)
      if (product.stock < item.qty) {
        throw new BadRequestError(`Insufficient stock for ${item.name}`);
      }
      
      // Calculate total
      const total = item.price * item.qty;
      
      validatedItems.push({
        product: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        thumbnail: item.thumbnail,
        variant: item.variant,
        total,
      });
    }
    
    return validatedItems;
  }
  
  private static async applyCoupon(couponCode: string, subtotal: number) {
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true,
      start: { $lte: new Date() },
      end: { $gte: new Date() },
      usedCount: { $lt: { $ifNull: ['$usageLimit', Number.MAX_VALUE] } },
    });
    
    if (!coupon) {
      throw new BadRequestError('Invalid or expired coupon');
    }
    
    let discountAmount = 0;
    
    if (coupon.type === 'flat') {
      discountAmount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === 'percent') {
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    }
    
    // Check minimum subtotal requirement
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      throw new BadRequestError(`Minimum order amount of $${coupon.minSubtotal} required`);
    }
    
    return {
      coupon,
      discountAmount,
    };
  }
  
  private static calculateShippingFee(subtotal: number): number {
    // Implement your shipping fee logic here
    // For now, using a simple flat rate
    return subtotal >= 50 ? 0 : 5; // Free shipping for orders over $50
  }
}
