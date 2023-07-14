import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService } from "@app/services/authentication/authentication.service";

@Injectable()
export class RefreshTokenErrorInterceptor implements HttpInterceptor{
    constructor(private auth: AuthenticationService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err) => {
                if ([401,403].includes(err.status) && this.auth.isAuthorized()) {
                    this.auth.refreshToken().subscribe();
                    location.reload();
                }
                const error = (err & err.error && err.error.message) || err.statusText;
                console.error(err);
                return throwError(()=>err);
            })
        )
    }
    
}