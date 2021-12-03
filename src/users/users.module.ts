import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './users.controller';
import { UserShema } from './users.model';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserShema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
