import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.model';
import { SignInCredentials, SignUpCredentials } from './auth-credentials.dto';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(signUpCredentials: SignUpCredentials): Promise<void> {
    const { email, password, userName } = signUpCredentials;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      userName,
    });

    try {
      await newUser.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: SignInCredentials,
  ): Promise<{ accesToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.createPayload(user, false);
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async secondFactorAuth(
    user: User,
    isSecondFactorAuthenticated: boolean,
  ): Promise<{ accesToken: string }> {
    return this.createPayload(user, isSecondFactorAuthenticated);
  }

  private async createPayload(
    user: User,
    isSecondFactorAuthenticated: boolean,
  ): Promise<{ accesToken: string }> {
    console.log(user, isSecondFactorAuthenticated);

    const payload: JwtPayload = {
      email: user.email,
      userName: user.userName,
      isSecondFactorAuthenticated,
      isTwoFactorEnabled: user.isTwoFactorAuthEnabled,
    };

    const accesToken: string = await this.jwtService.sign(payload);
    return { accesToken };
  }
}
