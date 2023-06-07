
export class Consts {
  baseUrl: string = `http://${location.hostname}:5000/api`;
  constructor() {}
  public DEFAULT_ERROR_MESSAGE = 'Извините, возникла ошибка';
  public URL_TOKEN = `${this.baseUrl}/token/`;
  public URL_TOKEN_REFRESH = `${this.baseUrl}/token/refresh/`;
  public URL_REGISTER = `${this.baseUrl}/accounts/register/`;
}
export type ServerError = {
  public: string,
  private:string
}
