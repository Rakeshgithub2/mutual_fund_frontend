import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  profilePicture?: string; // Google profile picture URL
  age?: number;
  riskLevel?: string; // LOW, MEDIUM, HIGH
  role: string; // USER, ADMIN
  isVerified: boolean;
  kycStatus: string; // PENDING, SUBMITTED, APPROVED, REJECTED

  // OAuth fields
  googleId?: string;
  provider?: string; // 'local' | 'google'

  // Two-factor authentication
  twoFactorAuth?: {
    secret?: string;
    enabled?: boolean;
    backupCodes?: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshToken {
  _id?: ObjectId;
  token: string;
  userId: ObjectId;
  expiresAt: Date;
  createdAt: Date;
}
