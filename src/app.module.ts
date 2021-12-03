import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,

    MongooseModule.forRoot(
      'mongodb+srv://Csongi:a1q4w5s2@cluster0.bccz4.mongodb.net/multiAuthDatabase?retryWrites=true&w=majority',
    ),

    TwoFactorAuthenticationModule,
  ],
})
export class AppModule {}
