
export class Consts {
  baseUrl: string = `http://${location.hostname}:5000/api`;
  constructor() {}
  public DEFAULT_ERROR_MESSAGE = 'Извините, возникла ошибка';
  public URL_TOKEN = `${this.baseUrl}/token/`;
  public URL_TOKEN_REFRESH = `${this.baseUrl}/token/refresh/`;
  public URL_REGISTER = `${this.baseUrl}/account/register/`;
  public URL_EMAIL_VERIFICATION = `${this.baseUrl}/account/register/verify-email-with-token/`;
}
export type ServerError = {
  public: string,
  private:string
}
