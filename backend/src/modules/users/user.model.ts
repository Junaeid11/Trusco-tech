import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IAddress } from '@/types';

export interface UserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['home', 'office', 'other'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: 'Bangladesh',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+880|880|0)?1[3456789]\d{8}$/, 'Please enter a valid phone number'],
    },
    passwordHash: {
      type: String,
      // Not required for Google OAuth users
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    avatar: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Password reset fields
    resetPasswordCode: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    addresses: [addressSchema],
    wishlist: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.resetPasswordCode;
        delete ret.resetPasswordExpiry;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ googleId: 1 });

// Virtual for password (not stored in DB)
userSchema.virtual('password').set(function(password: string) {
  this.passwordHash = bcrypt.hashSync(password, 12);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) {
    return false; // Google OAuth users don't have passwords
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Pre-save middleware to hash password if modified
userSchema.pre('save', function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  // Password is already hashed by virtual setter
  next();
});

// Static method to find user by email
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const User = mongoose.model<UserDocument>('User', userSchema);
