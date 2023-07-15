import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true, toJSON: { virtuals: true }
});

// check password
userSchema.statics.isPasswordMatched = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// hashing password
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
