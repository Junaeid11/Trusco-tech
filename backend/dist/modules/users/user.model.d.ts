import mongoose, { Document } from 'mongoose';
import { IUser } from '@/types';
export interface UserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument, {}, {}> & UserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.model.d.ts.map