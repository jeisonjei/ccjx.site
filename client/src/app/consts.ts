
export class Consts {
  baseUrl: string = `http://${location.hostname}:5000/api`;
  constructor() {}
  public DEFAULT_ERROR_MESSAGE = 'Извините, возникла ошибка';
  public URL_TOKEN = `${this.baseUrl}/token/`;
  public URL_TOKEN_REFRESH = `${this.baseUrl}/token/refresh/`;
  public URL_REGISTER = `${this.baseUrl}/account/register/`;
  public URL_EMAIL_VERIFICATION = `${this.baseUrl}/account/register/verify-email-with-token/`;
  public URL_SEND_EMAIL_NEW_PASS = `${this.baseUrl}/account/send-email-new-password/`;
  public URL_NEW_PASS = `${this.baseUrl}/account/new-pass/`;
}
export type ServerError = {
  public: string,
  private:string
}
