import mongoose, { Document } from 'mongoose';
import { IBrand } from '@/types';
export interface BrandDocument extends IBrand, Document {
}
export declare const Brand: mongoose.Model<BrandDocument, {}, {}, {}, mongoose.Document<unknown, {}, BrandDocument, {}, {}> & BrandDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=brand.model.d.ts.map