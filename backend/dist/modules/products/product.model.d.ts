import mongoose, { Document } from 'mongoose';
import { IProduct } from '@/types';
export interface ProductDocument extends IProduct, Document {
    getEffectivePrice(): number;
    isInStock(): boolean;
    hasDiscount(): boolean;
}
export declare const Product: mongoose.Model<ProductDocument, {}, {}, {}, mongoose.Document<unknown, {}, ProductDocument, {}, {}> & ProductDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=product.model.d.ts.map