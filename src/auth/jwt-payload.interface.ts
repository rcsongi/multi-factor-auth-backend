export interface JwtPayload {
  email: string;
  userName: string;
  isSecondFactorAuthenticated: boolean;
  isTwoFactorEnabled: boolean;
}
