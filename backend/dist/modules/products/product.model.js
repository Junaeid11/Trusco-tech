"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot be more than 200 characters'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, 'Brand is required'],
    },
    categories: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'At least one category is required'],
        }],
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail is required'],
        trim: true,
    },
    images: [{
            type: String,
            trim: true,
        }],
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    currency: {
        type: String,
        enum: ['BDT', 'USD'],
        default: 'BDT',
    },
    discount: {
        type: {
            type: String,
            enum: ['flat', 'percent'],
        },
        value: {
            type: Number,
            min: [0, 'Discount value cannot be negative'],
        },
        start: {
            type: Date,
        },
        end: {
            type: Date,
        },
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    attributes: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed,
        default: new Map(),
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        trim: true,
        maxlength: [500, 'Short description cannot be more than 500 characters'],
    },
    descriptionHtml: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    ratingAvg: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot be more than 5'],
    },
    ratingCount: {
        type: Number,
        default: 0,
        min: [0, 'Rating count cannot be negative'],
    },
    warranty: {
        type: String,
        trim: true,
    },
    emi: {
        enabled: {
            type: Boolean,
            default: false,
        },
        months: [{
                type: Number,
                min: [3, 'EMI months must be at least 3'],
                max: [36, 'EMI months cannot be more than 36'],
            }],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.effectivePrice = doc.getEffectivePrice();
            ret.isInStock = doc.isInStock();
            ret.hasDiscount = doc.hasDiscount();
            return ret;
        },
    },
});
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratingAvg: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ 'discount.end': 1 });
productSchema.index({ stock: 1 });
productSchema.index({
    name: 'text',
    shortDescription: 'text',
    'attributes.value': 'text',
});
productSchema.pre('save', function (next) {
    if (!this.isModified('name'))
        return next();
    this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
    next();
});
productSchema.methods.getEffectivePrice = function () {
    if (!this.hasDiscount()) {
        return this.price;
    }
    const now = new Date();
    if (this.discount.start && now < this.discount.start) {
        return this.price;
    }
    if (this.discount.end && now > this.discount.end) {
        return this.price;
    }
    if (this.discount.type === 'flat') {
        return Math.max(0, this.price - this.discount.value);
    }
    else {
        return this.price * (1 - this.discount.value / 100);
    }
};
productSchema.methods.isInStock = function () {
    return this.stock > 0;
};
productSchema.methods.hasDiscount = function () {
    if (!this.discount || !this.discount.value) {
        return false;
    }
    const now = new Date();
    if (this.discount.start && now < this.discount.start) {
        return false;
    }
    if (this.discount.end && now > this.discount.end) {
        return false;
    }
    return true;
};
productSchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug, isActive: true })
        .populate('brand', 'name slug logo')
        .populate('categories', 'name slug');
};
productSchema.statics.search = function (filters) {
    const query = { isActive: true };
    if (filters.q) {
        query.$text = { $search: filters.q };
    }
    if (filters.category) {
        query.categories = filters.category;
    }
    if (filters.brand) {
        query.brand = filters.brand;
    }
    if (filters.price) {
        query.price = {};
        if (filters.price.min !== undefined) {
            query.price.$gte = filters.price.min;
        }
        if (filters.price.max !== undefined) {
            query.price.$lte = filters.price.max;
        }
    }
    if (filters.rating?.min) {
        query.ratingAvg = { $gte: filters.rating.min };
    }
    if (filters.inStock === true) {
        query.stock = { $gt: 0 };
    }
    if (filters.attributes) {
        Object.entries(filters.attributes).forEach(([key, value]) => {
            query[`attributes.${key}`] = value;
        });
    }
    return this.find(query)
        .populate('brand', 'name slug logo')
        .populate('categories', 'name slug');
};
exports.Product = mongoose_1.default.model('Product', productSchema);
//# sourceMappingURL=product.model.js.map