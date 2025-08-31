import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { config } from './../../config/index';
import { User, UserDocument } from './../../modules/users/user.model';
import { AuthenticationError, ConflictError } from './../../utils/errors';
import { JWTPayload } from '@/types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  user: UserDocument;
  tokens: AuthTokens;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export class AuthService {
  private static googleClient = new OAuth2Client(config.google.clientId);

  // Email transporter setup
  private static emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.password, // use app password if 2FA is on
    },
  });
  

  static async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<UserDocument> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create new user
    const user = new User({
      name: userData.name,
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      password: userData.password, // Will be hashed by virtual setter
    });

    await user.save();
    return user;
  }

  static async login(email: string, password: string): Promise<LoginResult> {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  static async googleLogin(idToken: string): Promise<LoginResult> {
    try {
      // Verify Google ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: config.google.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new AuthenticationError('Invalid Google token');
      }

      const googleUserInfo: GoogleUserInfo = {
        id: payload.sub!,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
      };

      // Find or create user
      let user = await User.findOne({ email: googleUserInfo.email.toLowerCase() });

      if (!user) {
        // Create new user with Google info
        user = new User({
          name: googleUserInfo.name,
          email: googleUserInfo.email.toLowerCase(),
          googleId: googleUserInfo.id,
          avatar: googleUserInfo.picture,
          isEmailVerified: true, // Google emails are verified
        });
        await user.save();
      } else {
        // Update existing user with Google info if not already set
        if (!user.googleId) {
          user.googleId = googleUserInfo.id;
          user.avatar = googleUserInfo.picture;
          user.isEmailVerified = true;
          await user.save();
        }
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      return { user, tokens };
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticationError(`Google authentication failed: ${error.message}`);
      }
      throw new AuthenticationError('Google authentication failed');
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid refresh token');
      }
      throw error;
    }
  }

  static async logout(_userId: string): Promise<void> {
    // In a more advanced implementation, you might want to blacklist the refresh token
    // For now, we'll just return success
    return;
  }

  static generateTokens(user: UserDocument): AuthTokens {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpires,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpires,
    });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.accessSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid access token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Access token expired');
      }
      throw error;
    }
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = newPasswordHash;
    await user.save();
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset code with expiration (10 minutes)
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = resetCodeExpiry;
    await user.save();

    // Send email with reset code
    await this.sendPasswordResetEmail(user.email, user.name, resetCode);
  }

  static async verifyResetCode(email: string, code: string): Promise<boolean> {
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      resetPasswordCode: code,
      resetPasswordExpiry: { $gt: new Date() }
    });

    return !!user;
  }

  static async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<void> {
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      resetPasswordCode: code,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      throw new AuthenticationError('Invalid or expired reset code');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = newPasswordHash;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
  }

  private static async sendPasswordResetEmail(email: string, name: string, code: string): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: 'Password Reset Code - E-commerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>You have requested to reset your password. Use the following 6-digit code to complete the process:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>E-commerce Team</p>
        </div>
      `,
    };

    try {
      await this.emailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Legacy method for backward compatibility
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
      
      if (decoded.type !== 'password_reset') {
        throw new AuthenticationError('Invalid reset token');
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      user.passwordHash = newPasswordHash;
      await user.save();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid reset token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Reset token expired');
      }
      throw error;
    }
  }
}
