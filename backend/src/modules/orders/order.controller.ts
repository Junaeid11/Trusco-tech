import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { requireAuth, requireAdmin } from '@/middleware/auth';
import { ApiResponse } from '@/types';
import { z } from 'zod';

// Validation schemas
const guestOrderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  address: z.object({
    type: z.enum(['home', 'office', 'other']).default('home'),
    name: z.string().min(2, 'Address name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
    isDefault: z.boolean().default(false),
  }),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    qty: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().positive('Price must be positive'),
    name: z.string().min(1, 'Product name is required'),
    thumbnail: z.string().url('Invalid thumbnail URL'),
    variant: z.string().optional(),
  })).min(1, 'At least one item is required'),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export class OrderController {
  static async createGuestCODOrder(req: Request, res: Response<ApiResponse>) {
    try {
      // Validate request body
      const validatedData = guestOrderSchema.parse(req.body);
      
      const result = await OrderService.createGuestCODOrder(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: result.orderId,
          orderNumber: result.orderNumber,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order',
      });
    }
  }
  
  static async createUserOrder(req: Request, res: Response<ApiResponse>) {
    try {
      const userId = req.user!._id.toString();
      const { addressId, paymentProvider, couponCode, notes } = req.body;
      
      const result = await OrderService.createUserOrder(userId, {
        addressId,
        paymentProvider,
        couponCode,
        notes,
      });
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: result.orderId,
          orderNumber: result.orderNumber,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order',
      });
    }
  }
  
  static async getUserOrders(req: Request, res: Response<ApiResponse>) {
    try {
      const userId = req.user!._id.toString();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await OrderService.getUserOrders(userId, page, limit);
      
      res.json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
      });
    }
  }
  
  static async getGuestOrders(req: Request, res: Response<ApiResponse>) {
    try {
      const { email, phone } = req.query;
      
      if (!email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Email and phone are required',
        });
      }
      
      const orders = await OrderService.getGuestOrders(email as string, phone as string);
      
      res.json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
      });
    }
  }
  
  static async getOrderById(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const userId = req.user?._id.toString();
      
      const order = await OrderService.getOrderById(id, userId);
      
      res.json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Order not found',
      });
    }
  }
  
  static async updateOrderStatus(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      
      const order = await OrderService.updateOrderStatus(id, status, note);
      
      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update order status',
      });
    }
  }
}
