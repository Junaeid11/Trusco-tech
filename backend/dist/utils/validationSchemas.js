"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignUploadSchema = exports.createPaymentIntentSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = exports.createCouponSchema = exports.validateCouponSchema = exports.addToWishlistSchema = exports.updateCartItemSchema = exports.addToCartSchema = exports.updateReviewSchema = exports.createReviewSchema = exports.productFiltersSchema = exports.updateProductSchema = exports.createProductSchema = exports.updateBrandSchema = exports.createBrandSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.addAddressSchema = exports.addressSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = exports.paginationQuerySchema = exports.slugParamSchema = exports.idParamSchema = void 0;
const zod_1 = require("zod");
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});
exports.slugParamSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, 'Slug is required'),
});
exports.paginationQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1)).optional().default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(100)).optional().default('20'),
    sort: zod_1.z.string().optional(),
    fields: zod_1.z.string().optional(),
});
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        phone: zod_1.z.string().regex(/^(\+880|880|0)?1[3456789]\d{8}$/, 'Invalid phone number').optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: exports.idParamSchema,
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(50).optional(),
        phone: zod_1.z.string().regex(/^(\+880|880|0)?1[3456789]\d{8}$/).optional(),
        role: zod_1.z.enum(['customer', 'admin']).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.addressSchema = zod_1.z.object({
    type: zod_1.z.enum(['home', 'office', 'other']),
    name: zod_1.z.string().min(1, 'Name is required'),
    phone: zod_1.z.string().regex(/^(\+880|880|0)?1[3456789]\d{8}$/, 'Invalid phone number'),
    address: zod_1.z.string().min(1, 'Address is required'),
    city: zod_1.z.string().min(1, 'City is required'),
    state: zod_1.z.string().min(1, 'State is required'),
    postalCode: zod_1.z.string().min(1, 'Postal code is required'),
    country: zod_1.z.string().min(1, 'Country is required'),
    isDefault: zod_1.z.boolean().optional(),
});
exports.addAddressSchema = zod_1.z.object({
    body: exports.addressSchema,
});
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Category name is required').max(50, 'Category name cannot exceed 50 characters'),
        parent: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        sort: zod_1.z.number().optional(),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    params: exports.idParamSchema,
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(50).optional(),
        parent: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        sort: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.createBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Brand name is required').max(50, 'Brand name cannot exceed 50 characters'),
        logo: zod_1.z.string().url('Invalid logo URL').optional(),
    }),
});
exports.updateBrandSchema = zod_1.z.object({
    params: exports.idParamSchema,
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(50).optional(),
        logo: zod_1.z.string().url().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Product name is required').max(200, 'Product name cannot exceed 200 characters'),
        sku: zod_1.z.string().min(1, 'SKU is required').max(50, 'SKU cannot exceed 50 characters'),
        brand: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID'),
        categories: zod_1.z.array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1, 'At least one category is required'),
        thumbnail: zod_1.z.string().url('Invalid thumbnail URL'),
        images: zod_1.z.array(zod_1.z.string().url('Invalid image URL')).optional(),
        price: zod_1.z.number().min(0, 'Price cannot be negative'),
        currency: zod_1.z.enum(['BDT', 'USD']).optional(),
        discount: zod_1.z.object({
            type: zod_1.z.enum(['flat', 'percent']),
            value: zod_1.z.number().min(0),
            start: zod_1.z.string().datetime().optional(),
            end: zod_1.z.string().datetime().optional(),
        }).optional(),
        stock: zod_1.z.number().min(0, 'Stock cannot be negative'),
        attributes: zod_1.z.record(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
        shortDescription: zod_1.z.string().min(1, 'Short description is required').max(500, 'Short description cannot exceed 500 characters'),
        descriptionHtml: zod_1.z.string().min(1, 'Description is required'),
        warranty: zod_1.z.string().optional(),
        emi: zod_1.z.object({
            enabled: zod_1.z.boolean(),
            months: zod_1.z.array(zod_1.z.number().min(3).max(36)),
        }).optional(),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: exports.idParamSchema,
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200).optional(),
        sku: zod_1.z.string().min(1).max(50).optional(),
        brand: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        categories: zod_1.z.array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
        thumbnail: zod_1.z.string().url().optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        price: zod_1.z.number().min(0).optional(),
        currency: zod_1.z.enum(['BDT', 'USD']).optional(),
        discount: zod_1.z.object({
            type: zod_1.z.enum(['flat', 'percent']),
            value: zod_1.z.number().min(0),
            start: zod_1.z.string().datetime().optional(),
            end: zod_1.z.string().datetime().optional(),
        }).optional(),
        stock: zod_1.z.number().min(0).optional(),
        attributes: zod_1.z.record(zod_1.z.union([zod_1.z.string(), zod_1.z.number()])).optional(),
        shortDescription: zod_1.z.string().min(1).max(500).optional(),
        descriptionHtml: zod_1.z.string().min(1).optional(),
        warranty: zod_1.z.string().optional(),
        emi: zod_1.z.object({
            enabled: zod_1.z.boolean(),
            months: zod_1.z.array(zod_1.z.number().min(3).max(36)),
        }).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.productFiltersSchema = zod_1.z.object({
    query: zod_1.z.object({
        q: zod_1.z.string().optional(),
        category: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        brand: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        'price[min]': zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0)).optional(),
        'price[max]': zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0)).optional(),
        'rating[min]': zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(5)).optional(),
        inStock: zod_1.z.string().transform(val => val === 'true').optional(),
        sort: zod_1.z.string().optional(),
        page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1)).optional().default('1'),
        limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(100)).optional().default('20'),
        fields: zod_1.z.string().optional(),
    }),
});
exports.createReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    }),
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
        title: zod_1.z.string().max(100, 'Title cannot exceed 100 characters').optional(),
        body: zod_1.z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review cannot exceed 1000 characters'),
        photos: zod_1.z.array(zod_1.z.string().url('Invalid photo URL')).optional(),
    }),
});
exports.updateReviewSchema = zod_1.z.object({
    params: exports.idParamSchema,
    body: zod_1.z.object({
        rating: zod_1.z.number().min(1).max(5).optional(),
        title: zod_1.z.string().max(100).optional(),
        body: zod_1.z.string().min(10).max(1000).optional(),
        photos: zod_1.z.array(zod_1.z.string().url()).optional(),
        status: zod_1.z.enum(['visible', 'hidden']).optional(),
    }),
});
exports.addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
        qty: zod_1.z.number().min(1, 'Quantity must be at least 1'),
    }),
});
exports.updateCartItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    }),
    body: zod_1.z.object({
        qty: zod_1.z.number().min(1, 'Quantity must be at least 1'),
    }),
});
exports.addToWishlistSchema = zod_1.z.object({
    params: zod_1.z.object({
        productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    }),
});
exports.validateCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(1, 'Coupon code is required'),
        subtotal: zod_1.z.number().min(0, 'Subtotal cannot be negative'),
    }),
});
exports.createCouponSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(1, 'Coupon code is required').max(20, 'Coupon code cannot exceed 20 characters'),
        type: zod_1.z.enum(['flat', 'percent']),
        value: zod_1.z.number().min(0, 'Value cannot be negative'),
        minSubtotal: zod_1.z.number().min(0).optional(),
        maxDiscount: zod_1.z.number().min(0).optional(),
        start: zod_1.z.string().datetime('Invalid start date'),
        end: zod_1.z.string().datetime('Invalid end date'),
        usageLimit: zod_1.z.number().min(1).optional(),
    }),
});
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
            qty: zod_1.z.number().min(1, 'Quantity must be at least 1'),
        })).min(1, 'At least one item is required'),
        address: exports.addressSchema,
        couponCode: zod_1.z.string().optional(),
        paymentMethod: zod_1.z.enum(['stripe', 'sslcommerz']),
    }),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    params: exports.idParamSchema,
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
        note: zod_1.z.string().max(500).optional(),
    }),
});
exports.createPaymentIntentSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().min(1, 'Amount must be at least 1'),
        currency: zod_1.z.enum(['BDT', 'USD']).optional(),
        orderId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
    }),
});
exports.presignUploadSchema = zod_1.z.object({
    body: zod_1.z.object({
        fileName: zod_1.z.string().min(1, 'File name is required'),
        fileType: zod_1.z.string().min(1, 'File type is required'),
        folder: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=validationSchemas.js.map