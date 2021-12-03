import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { authenticator } from 'otplib';

import { toFileStream } from 'qrcode';
import { ServerResponse } from 'http';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      'MultiFactorApp',
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async turnOffTwoFactorAuthentication(user: User): Promise<void> {
    await this.usersService.turnOffTwoFactorAuthentication(user.id);

    return;
  }

  public async pipeQrCodeStream(stream: ServerResponse, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ): boolean {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
