import * as mongoose from 'mongoose';

export const UserShema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  twoFactorAuthenticationSecret: { type: String, required: false },
  profilePicUrl: { type: String, required: false },
  isTwoFactorAuthEnabled: { type: Boolean, required: false },
});

export interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
  twoFactorAuthenticationSecret: string;
  profilePicUrl: string;
  isTwoFactorAuthEnabled: boolean;
}
