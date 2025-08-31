import { Request, Response } from 'express';
import { ProductService, ProductFilters } from './product.service';
import { ApiResponse } from '@/types';
import { z } from 'zod';
import { UploadService } from '../uploads/upload.service';

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(1, 'SKU is required'),
  brand: z.string().min(1, 'Brand is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  price: z.number().positive('Price must be positive'),
  currency: z.enum(['BDT', 'USD']).default('USD'),
  discount: z.object({
    type: z.enum(['flat', 'percent']),
    value: z.number().min(0),
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  attributes: z.record(z.union([z.string(), z.number()])).optional(),
  shortDescription: z.string().min(1, 'Short description is required'),
  descriptionHtml: z.string().min(1, 'Description is required'),
  warranty: z.string().optional(),
  emi: z.object({
    enabled: z.boolean(),
    months: z.array(z.number().min(3).max(36)),
  }).optional(),
});

const updateProductSchema = createProductSchema.partial();

export class ProductController {
  static async getProducts(req: Request, res: Response<ApiResponse>) {
    try {
      const filters: ProductFilters = {
        q: req.query.q as string,
        category: req.query.category as string,
        brand: req.query.brand as string,
        price: req.query.price ? {
          min: req.query.price.min ? parseFloat(req.query.price.min as string) : undefined,
          max: req.query.price.max ? parseFloat(req.query.price.max as string) : undefined,
        } : undefined,
        rating: req.query.rating ? {
          min: req.query.rating.min ? parseFloat(req.query.rating.min as string) : undefined,
        } : undefined,
        inStock: req.query.inStock === 'true',
        attributes: req.query.attributes ? JSON.parse(req.query.attributes as string) : undefined,
        sort: req.query.sort as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };
      
      const result = await ProductService.getProducts(filters);
      
      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: result.products,
        pagination: result.pagination,
        facets: result.facets,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
      });
    }
  }
  
  static async getProductBySlug(req: Request, res: Response<ApiResponse>) {
    try {
      const { slug } = req.params;
      const product = await ProductService.getProductBySlug(slug);
      
      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Product not found',
      });
    }
  }
  
  static async getProductById(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      
      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Product not found',
      });
    }
  }
  
  static async getRelatedProducts(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const products = await ProductService.getRelatedProducts(id, limit);
      
      res.json({
        success: true,
        message: 'Related products retrieved successfully',
        data: products,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Product not found',
      });
    }
  }
  
  static async createProduct(req: Request, res: Response<ApiResponse>) {
    try {
      // Parse JSON fields from form data
      const formData = req.body;
      const productData: any = {
        name: formData.name,
        sku: formData.sku,
        brand: formData.brand,
        categories: JSON.parse(formData.categories || '[]'),
        price: parseFloat(formData.price),
        currency: formData.currency || 'USD',
        stock: parseInt(formData.stock),
        shortDescription: formData.shortDescription,
        descriptionHtml: formData.descriptionHtml,
        warranty: formData.warranty,
      };

      // Parse optional JSON fields
      if (formData.discount) {
        productData.discount = JSON.parse(formData.discount);
      }
      if (formData.attributes) {
        productData.attributes = JSON.parse(formData.attributes);
      }
      if (formData.emi) {
        productData.emi = JSON.parse(formData.emi);
      }

      // Validate the parsed data
      const validatedData = createProductSchema.parse(productData);
      
      // Handle file uploads
      let imageUrls: string[] = [];
      
   
      
      // Upload additional images if provided
      if (req.files && req.files['images']) {
        const imageFiles = Array.isArray(req.files['images']) 
          ? req.files['images'] 
          : [req.files['images']];
        
        const uploadPromises = imageFiles.map(file => UploadService.uploadToCloudinary(file));
        const uploadResults = await Promise.all(uploadPromises);
        imageUrls = uploadResults.map(result => result.url);
      }
      
      // Create product with uploaded URLs
      
      const finalProductData = {
        ...validatedData,
        images: imageUrls,
      };
      
      const product = await ProductService.createProduct(finalProductData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
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
        message: error instanceof Error ? error.message : 'Failed to create product',
      });
    }
  }
  
  static async updateProduct(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      const validatedData = updateProductSchema.parse(req.body);
      const product = await ProductService.updateProduct(id, validatedData);
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.errors,
        });
      }
      
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Product not found',
      });
    }
  }
  
  static async deleteProduct(req: Request, res: Response<ApiResponse>) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      
      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Product not found',
      });
    }
  }
}
