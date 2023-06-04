import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }
  getAccessToken(): Observable<string>{
    const token: string = <string>localStorage.getItem('access');
    return of(token);
  }
  getRefreshToken(): Observable<string>{
    const token: string = <string>localStorage.getItem('refresh');
    return of(token);
  }
  setAccessToken(token: string): TokenStorageService{
    localStorage.setItem('access', token);
    return this;
  }
  setRefreshToken(token: string): TokenStorageService{
    localStorage.setItem('refresh', token);
    return this;
  }
  clear(): void{
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
}
