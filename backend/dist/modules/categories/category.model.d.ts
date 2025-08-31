import mongoose, { Document } from 'mongoose';
import { ICategory } from '@/types';
export interface CategoryDocument extends ICategory, Document {
}
export declare const Category: mongoose.Model<CategoryDocument, {}, {}, {}, mongoose.Document<unknown, {}, CategoryDocument, {}, {}> & CategoryDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=category.model.d.ts.map