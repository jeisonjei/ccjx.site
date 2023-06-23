import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ObservableInput, catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from "../../services/error-handler.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  constructor(private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router,
    private eh: ErrorHandlerService) {
    eh.pubmEvent.subscribe(
      (pubm) => {
        this.pubm = pubm;
        }
      )
   }
  pubm: string | undefined;
  showWarning: boolean = false;
  waiting: boolean = false;
  login(f: FormControl) {
    this.waiting = true;
    this.auth.login(f).subscribe({
      next: (data) => {
        this.router.navigateByUrl('');
        this.waiting = false;
      },
      error: (error) => {
        this.showWarning = true;
        this.eh.handleError(error.error);
        this.waiting = false;
      }
    })
  }
}
