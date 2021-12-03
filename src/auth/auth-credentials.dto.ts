import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInCredentials {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class SignUpCredentials {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  userName: string;

  @IsString()
  @MinLength(8, { message: 'Password must be between 8 and 32 caracter' })
  @MaxLength(32, { message: 'Password must be between 8 and 32 caracter' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
