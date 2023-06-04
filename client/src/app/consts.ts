import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export class Consts {
  baseUrl: string = `http://${location.hostname}:5000/api`;
  constructor() {}
  public displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  public URL_TOKEN = `${this.baseUrl}/token/`;
  public URL_TOKEN_REFRESH = `${this.baseUrl}/token/refresh/`;
}
