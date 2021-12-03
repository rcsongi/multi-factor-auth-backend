import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getAllUser() {
    const users = await this.userModel.find();
    return users.map(
      (u): User => ({
        id: u.id,
        userName: u.userName,
        email: u.email,
        password: u.password,
        profilePicUrl: u.profilePicUrl,
        twoFactorAuthenticationSecret: u.twoFactorAuthenticationSecret,
        isTwoFactorAuthEnabled: u.isTwoFactorAuthEnabled,
      }),
    );
  }

  async getUserByEmail(email: string): Promise<User> {
    const u = await this.userModel.findOne({ email });

    return {
      id: u.id,
      userName: u.userName,
      email: u.email,
      password: u.password,
      profilePicUrl: u.profilePicUrl,
      twoFactorAuthenticationSecret: u.twoFactorAuthenticationSecret,
      isTwoFactorAuthEnabled: u.isTwoFactorAuthEnabled,
    };
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    const currentUser = await this.userModel.findById(userId);

    currentUser.twoFactorAuthenticationSecret = secret;

    currentUser.save();
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    const currentUser = await this.userModel.findById(userId);

    currentUser.isTwoFactorAuthEnabled = true;

    currentUser.save();
  }

  async turnOffTwoFactorAuthentication(userId: string) {
    const currentUser = await this.userModel.findById(userId);

    currentUser.twoFactorAuthenticationSecret = null;
    currentUser.isTwoFactorAuthEnabled = false;

    currentUser.save();
  }
}
