import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserShema } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserShema }]),
    AuthModule,
  ],
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService, UsersService],
})
export class TwoFactorAuthenticationModule {}
