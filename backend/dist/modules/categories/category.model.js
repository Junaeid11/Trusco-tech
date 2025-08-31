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
exports.Category = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    path: [{
            type: String,
            required: true,
        }],
    isActive: {
        type: Boolean,
        default: true,
    },
    sort: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ isActive: 1, sort: 1 });
categorySchema.pre('save', async function (next) {
    if (!this.isModified('name'))
        return next();
    this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
    if (this.parent) {
        const parentCategory = await this.constructor.findById(this.parent);
        if (parentCategory) {
            this.path = [...parentCategory.path, this.name];
        }
        else {
            this.path = [this.name];
        }
    }
    else {
        this.path = [this.name];
    }
    next();
});
categorySchema.statics.getTree = function () {
    return this.aggregate([
        {
            $match: { isActive: true }
        },
        {
            $graphLookup: {
                from: 'categories',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'parent',
                as: 'children',
                restrictSearchWithMatch: { isActive: true }
            }
        },
        {
            $match: { parent: null }
        },
        {
            $sort: { sort: 1, name: 1 }
        }
    ]);
};
categorySchema.statics.getFlat = function () {
    return this.find({ isActive: true })
        .sort({ sort: 1, name: 1 })
        .populate('parent', 'name slug');
};
categorySchema.methods.getDescendants = function () {
    return this.constructor.find({
        path: { $regex: `^${this.path.join(' > ')}` },
        _id: { $ne: this._id }
    }).sort({ path: 1 });
};
categorySchema.methods.getAncestors = function () {
    if (!this.parent)
        return [];
    return this.constructor.find({
        _id: { $in: this.path.slice(0, -1).map(name => this.constructor.findOne({ name, path: { $regex: `^${name}` } })) }
    });
};
exports.Category = mongoose_1.default.model('Category', categorySchema);
//# sourceMappingURL=category.model.js.map