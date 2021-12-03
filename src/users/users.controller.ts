import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import JwtTwoFactorGuard from 'src/auth/jwt-two-factor.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtTwoFactorGuard)
  async getUsers() {
    return await this.userService.getAllUser();
  }
}
