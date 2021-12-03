import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ServerResponse } from 'http';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { TwofactorAuthenticationCodeDto } from './two-factor-authentication-code.dto';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Controller('tfa')
@UseGuards(AuthGuard())
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('generate')
  async register(@Res() response: ServerResponse, @GetUser() user: User) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }

  @Post('turn-off')
  async tunrOff(@GetUser() user: User) {
    await this.twoFactorAuthenticationService.turnOffTwoFactorAuthentication(
      user,
    );

    return this.authService.secondFactorAuth(user, false);
  }

  @Post('authenticate')
  async authenticate(
    @GetUser() user: User,
    @Body() dto: TwofactorAuthenticationCodeDto,
  ) {
    const { twoFactorAuthenticationCode } = dto;

    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      );
    if (!isCodeValid) {
      throw new NotAcceptableException('Wrong authentication code');
    } else {
      return this.authService.secondFactorAuth(user, true);
    }
  }

  @Post('turn-on')
  async turnOnTwofactorAuthentication(
    @GetUser() user: User,
    @Body()
    dto: TwofactorAuthenticationCodeDto,
  ): Promise<{ accesToken: string }> {
    const { twoFactorAuthenticationCode } = dto;

    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    this.userService.turnOnTwoFactorAuthentication(user.id);

    return this.authService.secondFactorAuth(user, true);
  }
}
