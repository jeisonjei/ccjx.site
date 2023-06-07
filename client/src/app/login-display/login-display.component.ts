import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { ErrorHandlerService } from '../services/errors/error-handler.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-display',
  templateUrl: './login-display.component.html',
  styleUrls: ['./login-display.component.scss']
})
export class LoginDisplayComponent {
  pubm: string | undefined;
  constructor(public auth: AuthenticationService, private eh: ErrorHandlerService, private http: HttpClient) {
    this.eh.pubmEvent.subscribe((v) => {
      this.pubm = v;
    })
  }
  
}
