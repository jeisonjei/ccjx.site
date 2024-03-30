import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  Subject,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'ngx-auth';
import jwtDecode from 'jwt-decode';
import { UrlsService } from 'src/app/services/urls.service';


export interface LoginInfo {
  isLoggedIn: boolean;
  id?: string;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements AuthService {
  loggedIn: BehaviorSubject<LoginInfo | null> = new BehaviorSubject<LoginInfo | null>(null);
  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private urls:UrlsService
  ) {
    this.isAuthorized().subscribe((x) => {
      if (x) {
        this.loggedIn.next(this.getCuFromToken());
      } else {
        this.loggedIn.next(null);
      }
    });
  }
  public get userValue() {
    return this.loggedIn.value;
  }
  public refreshShouldHappen(response: HttpErrorResponse, request?: HttpRequest<any> | undefined): boolean {
    return response.status === 401;
  }

  public isAuthorized(): Observable<boolean> {
    /**
     * Этот метод всего лишь проверяет, есть ли сохранённые токены или нет. Он не проверяет верность токенов
     */
    return this.tokenStorage.getAccessToken().pipe(map((token) => !!token));
  }

  public getAccessToken(): Observable<string> {
    return this.tokenStorage.getAccessToken();
  }

  public getDecodedAccessToken(): object | null {
    let decoded: any;
    this.getAccessToken().subscribe((t) => {
      let token = t;
      let jwt: any;
      try {
        jwt = jwtDecode(token);
        let s = JSON.stringify(jwt);
        decoded = JSON.parse(s);
      } catch (Error) {
        decoded = null;
      }
    });
    return decoded;
  }

  public refreshToken(): Observable<any> {
    return this.tokenStorage.getRefreshToken().pipe(
      switchMap((refreshToken: any) =>
        this.http.post(this.urls.URL_TOKEN_REFRESH, { refresh: refreshToken })
      ),
      tap((tokens) => {
        this.saveAccessData(tokens);
        this.loggedIn.next(this.getCuFromToken());
      }),
      catchError((err) => {
        this.logout();

        return throwError(()=>err);
      })
    );
  }

  
  public verifyRefreshToken(req:HttpRequest<any>): boolean {
    return req.url.endsWith('/refresh/');
  }

  public login(f: FormControl): Observable<any> {
    return this.http.post(this.urls.URL_TOKEN, f, { withCredentials: true }).pipe(
      tap((tokens) => {
        this.saveAccessData(tokens);
        this.loggedIn.next(this.getCuFromToken());
      }),
    );
  }

  private getCuFromToken() {
    let jwtObject: any = this.getDecodedAccessToken();
    let email: string;
    let id: string;
    if (jwtObject != null) {
      id = jwtObject.user_id;
      email = jwtObject.email;
    } else {
      id = '';
      email = '';
    }
    return { isLoggedIn: true, id: id, userEmail: email };
  }
  public logout(): void {
    this.tokenStorage.clear();
    this.loggedIn.next(null);
  }

  private saveAccessData(tokens: any) {
    let s = JSON.stringify(tokens);
    let o = JSON.parse(s);
    let accessToken = o.access;
    let refreshToken = o.refresh;
    this.tokenStorage.setAccessToken(accessToken).setRefreshToken(refreshToken);
  }
}
