import { Body, Controller, Post } from '@nestjs/common';
import { SignInCredentials, SignUpCredentials } from './auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  async register(@Body() signUpCredentials: SignUpCredentials) {
    return await this.authService.createUser(signUpCredentials);
  }

  @Post('signIn')
  async signIn(
    @Body() signInCredentials: SignInCredentials,
  ): Promise<{ accesToken: string }> {
    return await this.authService.signIn(signInCredentials);
  }
}
