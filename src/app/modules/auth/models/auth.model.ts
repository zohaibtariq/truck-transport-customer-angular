export class AuthModel {
  profile: object;
  authToken: string;
  refreshToken: string;
  expiresIn: Date;

  setAuth(auth: AuthModel) {
    this.profile = auth.profile;
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}
