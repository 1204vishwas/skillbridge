import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { Types } from 'mongoose';

export function signToken(userId: Types.ObjectId | string): string {
  const secret = process.env.JWT_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId.toString() }, secret, options);
}
