import { z } from 'zod';
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const slugParamSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
    sort: z.ZodOptional<z.ZodString>;
    fields: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort?: string | undefined;
    fields?: string | undefined;
}, {
    sort?: string | undefined;
    limit?: string | undefined;
    fields?: string | undefined;
    page?: string | undefined;
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        password: string;
        phone?: string | undefined;
    }, {
        name: string;
        email: string;
        password: string;
        phone?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        email: string;
        password: string;
        phone?: string | undefined;
    };
}, {
    body: {
        name: string;
        email: string;
        password: string;
        phone?: string | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const updateUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["customer", "admin"]>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        phone?: string | undefined;
        role?: "customer" | "admin" | undefined;
        isActive?: boolean | undefined;
    }, {
        name?: string | undefined;
        phone?: string | undefined;
        role?: "customer" | "admin" | undefined;
        isActive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        role?: "customer" | "admin" | undefined;
        isActive?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        phone?: string | undefined;
        role?: "customer" | "admin" | undefined;
        isActive?: boolean | undefined;
    };
}>;
export declare const addressSchema: z.ZodObject<{
    type: z.ZodEnum<["home", "office", "other"]>;
    name: z.ZodString;
    phone: z.ZodString;
    address: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodString;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "home" | "office" | "other";
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean | undefined;
}, {
    type: "home" | "office" | "other";
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean | undefined;
}>;
export declare const addAddressSchema: z.ZodObject<{
    body: z.ZodObject<{
        type: z.ZodEnum<["home", "office", "other"]>;
        name: z.ZodString;
        phone: z.ZodString;
        address: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        postalCode: z.ZodString;
        country: z.ZodString;
        isDefault: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "home" | "office" | "other";
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault?: boolean | undefined;
    }, {
        type: "home" | "office" | "other";
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: "home" | "office" | "other";
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault?: boolean | undefined;
    };
}, {
    body: {
        type: "home" | "office" | "other";
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault?: boolean | undefined;
    };
}>;
export declare const createCategorySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        parent: z.ZodOptional<z.ZodString>;
        sort: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        sort?: number | undefined;
        parent?: string | undefined;
    }, {
        name: string;
        sort?: number | undefined;
        parent?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        sort?: number | undefined;
        parent?: string | undefined;
    };
}, {
    body: {
        name: string;
        sort?: number | undefined;
        parent?: string | undefined;
    };
}>;
export declare const updateCategorySchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        parent: z.ZodOptional<z.ZodString>;
        sort: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        sort?: number | undefined;
        isActive?: boolean | undefined;
        parent?: string | undefined;
    }, {
        name?: string | undefined;
        sort?: number | undefined;
        isActive?: boolean | undefined;
        parent?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        sort?: number | undefined;
        isActive?: boolean | undefined;
        parent?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        sort?: number | undefined;
        isActive?: boolean | undefined;
        parent?: string | undefined;
    };
}>;
export declare const createBrandSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        logo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        logo?: string | undefined;
    }, {
        name: string;
        logo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        logo?: string | undefined;
    };
}, {
    body: {
        name: string;
        logo?: string | undefined;
    };
}>;
export declare const updateBrandSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        logo: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        isActive?: boolean | undefined;
        logo?: string | undefined;
    }, {
        name?: string | undefined;
        isActive?: boolean | undefined;
        logo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        isActive?: boolean | undefined;
        logo?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        isActive?: boolean | undefined;
        logo?: string | undefined;
    };
}>;
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        sku: z.ZodString;
        brand: z.ZodString;
        categories: z.ZodArray<z.ZodString, "many">;
        thumbnail: z.ZodString;
        images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        price: z.ZodNumber;
        currency: z.ZodOptional<z.ZodEnum<["BDT", "USD"]>>;
        discount: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<["flat", "percent"]>;
            value: z.ZodNumber;
            start: z.ZodOptional<z.ZodString>;
            end: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        }, {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        }>>;
        stock: z.ZodNumber;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
        shortDescription: z.ZodString;
        descriptionHtml: z.ZodString;
        warranty: z.ZodOptional<z.ZodString>;
        emi: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            months: z.ZodArray<z.ZodNumber, "many">;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            months: number[];
        }, {
            enabled: boolean;
            months: number[];
        }>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        sku: string;
        brand: string;
        categories: string[];
        thumbnail: string;
        price: number;
        stock: number;
        shortDescription: string;
        descriptionHtml: string;
        images?: string[] | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        attributes?: Record<string, string | number> | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    }, {
        name: string;
        sku: string;
        brand: string;
        categories: string[];
        thumbnail: string;
        price: number;
        stock: number;
        shortDescription: string;
        descriptionHtml: string;
        images?: string[] | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        attributes?: Record<string, string | number> | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        sku: string;
        brand: string;
        categories: string[];
        thumbnail: string;
        price: number;
        stock: number;
        shortDescription: string;
        descriptionHtml: string;
        images?: string[] | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        attributes?: Record<string, string | number> | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    };
}, {
    body: {
        name: string;
        sku: string;
        brand: string;
        categories: string[];
        thumbnail: string;
        price: number;
        stock: number;
        shortDescription: string;
        descriptionHtml: string;
        images?: string[] | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        attributes?: Record<string, string | number> | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    };
}>;
export declare const updateProductSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        sku: z.ZodOptional<z.ZodString>;
        brand: z.ZodOptional<z.ZodString>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        thumbnail: z.ZodOptional<z.ZodString>;
        images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        price: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodOptional<z.ZodEnum<["BDT", "USD"]>>;
        discount: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<["flat", "percent"]>;
            value: z.ZodNumber;
            start: z.ZodOptional<z.ZodString>;
            end: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        }, {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        }>>;
        stock: z.ZodOptional<z.ZodNumber>;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
        shortDescription: z.ZodOptional<z.ZodString>;
        descriptionHtml: z.ZodOptional<z.ZodString>;
        warranty: z.ZodOptional<z.ZodString>;
        emi: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            months: z.ZodArray<z.ZodNumber, "many">;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            months: number[];
        }, {
            enabled: boolean;
            months: number[];
        }>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        isActive?: boolean | undefined;
        sku?: string | undefined;
        brand?: string | undefined;
        categories?: string[] | undefined;
        thumbnail?: string | undefined;
        images?: string[] | undefined;
        price?: number | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        stock?: number | undefined;
        attributes?: Record<string, string | number> | undefined;
        shortDescription?: string | undefined;
        descriptionHtml?: string | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    }, {
        name?: string | undefined;
        isActive?: boolean | undefined;
        sku?: string | undefined;
        brand?: string | undefined;
        categories?: string[] | undefined;
        thumbnail?: string | undefined;
        images?: string[] | undefined;
        price?: number | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        stock?: number | undefined;
        attributes?: Record<string, string | number> | undefined;
        shortDescription?: string | undefined;
        descriptionHtml?: string | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        isActive?: boolean | undefined;
        sku?: string | undefined;
        brand?: string | undefined;
        categories?: string[] | undefined;
        thumbnail?: string | undefined;
        images?: string[] | undefined;
        price?: number | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        stock?: number | undefined;
        attributes?: Record<string, string | number> | undefined;
        shortDescription?: string | undefined;
        descriptionHtml?: string | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        isActive?: boolean | undefined;
        sku?: string | undefined;
        brand?: string | undefined;
        categories?: string[] | undefined;
        thumbnail?: string | undefined;
        images?: string[] | undefined;
        price?: number | undefined;
        currency?: "BDT" | "USD" | undefined;
        discount?: {
            type: "flat" | "percent";
            value: number;
            end?: string | undefined;
            start?: string | undefined;
        } | undefined;
        stock?: number | undefined;
        attributes?: Record<string, string | number> | undefined;
        shortDescription?: string | undefined;
        descriptionHtml?: string | undefined;
        warranty?: string | undefined;
        emi?: {
            enabled: boolean;
            months: number[];
        } | undefined;
    };
}>;
export declare const productFiltersSchema: z.ZodObject<{
    query: z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        brand: z.ZodOptional<z.ZodString>;
        'price[min]': z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        'price[max]': z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        'rating[min]': z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        inStock: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
        sort: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
        fields: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sort?: string | undefined;
        fields?: string | undefined;
        brand?: string | undefined;
        q?: string | undefined;
        category?: string | undefined;
        'price[min]'?: number | undefined;
        'price[max]'?: number | undefined;
        'rating[min]'?: number | undefined;
        inStock?: boolean | undefined;
    }, {
        sort?: string | undefined;
        limit?: string | undefined;
        fields?: string | undefined;
        page?: string | undefined;
        brand?: string | undefined;
        q?: string | undefined;
        category?: string | undefined;
        'price[min]'?: string | undefined;
        'price[max]'?: string | undefined;
        'rating[min]'?: string | undefined;
        inStock?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sort?: string | undefined;
        fields?: string | undefined;
        brand?: string | undefined;
        q?: string | undefined;
        category?: string | undefined;
        'price[min]'?: number | undefined;
        'price[max]'?: number | undefined;
        'rating[min]'?: number | undefined;
        inStock?: boolean | undefined;
    };
}, {
    query: {
        sort?: string | undefined;
        limit?: string | undefined;
        fields?: string | undefined;
        page?: string | undefined;
        brand?: string | undefined;
        q?: string | undefined;
        category?: string | undefined;
        'price[min]'?: string | undefined;
        'price[max]'?: string | undefined;
        'rating[min]'?: string | undefined;
        inStock?: string | undefined;
    };
}>;
export declare const createReviewSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        rating: z.ZodNumber;
        title: z.ZodOptional<z.ZodString>;
        body: z.ZodString;
        photos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        body: string;
        rating: number;
        title?: string | undefined;
        photos?: string[] | undefined;
    }, {
        body: string;
        rating: number;
        title?: string | undefined;
        photos?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        body: string;
        rating: number;
        title?: string | undefined;
        photos?: string[] | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        body: string;
        rating: number;
        title?: string | undefined;
        photos?: string[] | undefined;
    };
}>;
export declare const updateReviewSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        rating: z.ZodOptional<z.ZodNumber>;
        title: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        photos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        status: z.ZodOptional<z.ZodEnum<["visible", "hidden"]>>;
    }, "strip", z.ZodTypeAny, {
        status?: "visible" | "hidden" | undefined;
        body?: string | undefined;
        rating?: number | undefined;
        title?: string | undefined;
        photos?: string[] | undefined;
    }, {
        status?: "visible" | "hidden" | undefined;
        body?: string | undefined;
        rating?: number | undefined;
        title?: string | undefined;
        photos?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status?: "visible" | "hidden" | undefined;
        body?: string | undefined;
        rating?: number | undefined;
        title?: string | undefined;
        photos?: string[] | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status?: "visible" | "hidden" | undefined;
        body?: string | undefined;
        rating?: number | undefined;
        title?: string | undefined;
        photos?: string[] | undefined;
    };
}>;
export declare const addToCartSchema: z.ZodObject<{
    body: z.ZodObject<{
        productId: z.ZodString;
        qty: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        qty: number;
    }, {
        productId: string;
        qty: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        productId: string;
        qty: number;
    };
}, {
    body: {
        productId: string;
        qty: number;
    };
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        productId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        productId: string;
    }, {
        productId: string;
    }>;
    body: z.ZodObject<{
        qty: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        qty: number;
    }, {
        qty: number;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        productId: string;
    };
    body: {
        qty: number;
    };
}, {
    params: {
        productId: string;
    };
    body: {
        qty: number;
    };
}>;
export declare const addToWishlistSchema: z.ZodObject<{
    params: z.ZodObject<{
        productId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        productId: string;
    }, {
        productId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        productId: string;
    };
}, {
    params: {
        productId: string;
    };
}>;
export declare const validateCouponSchema: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
        subtotal: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        code: string;
        subtotal: number;
    }, {
        code: string;
        subtotal: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        code: string;
        subtotal: number;
    };
}, {
    body: {
        code: string;
        subtotal: number;
    };
}>;
export declare const createCouponSchema: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
        type: z.ZodEnum<["flat", "percent"]>;
        value: z.ZodNumber;
        minSubtotal: z.ZodOptional<z.ZodNumber>;
        maxDiscount: z.ZodOptional<z.ZodNumber>;
        start: z.ZodString;
        end: z.ZodString;
        usageLimit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "flat" | "percent";
        end: string;
        value: number;
        code: string;
        start: string;
        minSubtotal?: number | undefined;
        maxDiscount?: number | undefined;
        usageLimit?: number | undefined;
    }, {
        type: "flat" | "percent";
        end: string;
        value: number;
        code: string;
        start: string;
        minSubtotal?: number | undefined;
        maxDiscount?: number | undefined;
        usageLimit?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: "flat" | "percent";
        end: string;
        value: number;
        code: string;
        start: string;
        minSubtotal?: number | undefined;
        maxDiscount?: number | undefined;
        usageLimit?: number | undefined;
    };
}, {
    body: {
        type: "flat" | "percent";
        end: string;
        value: number;
        code: string;
        start: string;
        minSubtotal?: number | undefined;
        maxDiscount?: number | undefined;
        usageLimit?: number | undefined;
    };
}>;
export declare const createOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            qty: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            qty: number;
        }, {
            productId: string;
            qty: number;
        }>, "many">;
        address: z.ZodObject<{
            type: z.ZodEnum<["home", "office", "other"]>;
            name: z.ZodString;
            phone: z.ZodString;
            address: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            postalCode: z.ZodString;
            country: z.ZodString;
            isDefault: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            type: "home" | "office" | "other";
            name: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault?: boolean | undefined;
        }, {
            type: "home" | "office" | "other";
            name: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault?: boolean | undefined;
        }>;
        couponCode: z.ZodOptional<z.ZodString>;
        paymentMethod: z.ZodEnum<["stripe", "sslcommerz"]>;
    }, "strip", z.ZodTypeAny, {
        address: {
            type: "home" | "office" | "other";
            name: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault?: boolean | undefined;
        };
        items: {
            productId: string;
            qty: number;
        }[];
        paymentMethod: "stripe" | "sslcommerz";
        couponCode?: string | undefined;
    }, {
        address: {
            type: "home" | "office" | "other";
            name: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault?: boolean | undefined;
        };
        items: {
            productId: string;
            qty: number;
        }[];
        paymentMethod: "stripe" | "sslcommerz";
        couponCode?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        address: {
            type: "home" | "office" | "other";
            name: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault?: boolean | undefined;
        };
        items: {
            productId: string;
            qty: number;
        }[];
        paymentMethod: "stripe" | "sslcommerz";
        couponCode?: string | undefined;
    };
}, {
    body: {
        address: {
            type: "home" | "office" | "other";
            name: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            isDefault?: boolean | undefined;
        };
        items: {
            productId: string;
            qty: number;
        }[];
        paymentMethod: "stripe" | "sslcommerz";
        couponCode?: string | undefined;
    };
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]>;
        note: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
        note?: string | undefined;
    }, {
        status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
        note?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
        note?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
        note?: string | undefined;
    };
}>;
export declare const createPaymentIntentSchema: z.ZodObject<{
    body: z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodOptional<z.ZodEnum<["BDT", "USD"]>>;
        orderId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        orderId: string;
        currency?: "BDT" | "USD" | undefined;
    }, {
        amount: number;
        orderId: string;
        currency?: "BDT" | "USD" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        amount: number;
        orderId: string;
        currency?: "BDT" | "USD" | undefined;
    };
}, {
    body: {
        amount: number;
        orderId: string;
        currency?: "BDT" | "USD" | undefined;
    };
}>;
export declare const presignUploadSchema: z.ZodObject<{
    body: z.ZodObject<{
        fileName: z.ZodString;
        fileType: z.ZodString;
        folder: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        fileName: string;
        fileType: string;
        folder?: string | undefined;
    }, {
        fileName: string;
        fileType: string;
        folder?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        fileName: string;
        fileType: string;
        folder?: string | undefined;
    };
}, {
    body: {
        fileName: string;
        fileType: string;
        folder?: string | undefined;
    };
}>;
//# sourceMappingURL=validationSchemas.d.ts.map