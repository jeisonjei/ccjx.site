import { Component } from '@angular/core';
import { AuthenticationService, LoginInfo } from '@app/services/authentication/authentication.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';

@Component({
  selector: 'app-login-display-small',
  templateUrl: './login-display-small.component.html',
  styleUrls: ['./login-display-small.component.scss']
})
export class LoginDisplaySmallComponent {
  pubm?: string;
  userValue?: LoginInfo | null;
  constructor(public auth: AuthenticationService, private eh: ErrorHandlerService) { }
  ngOnInit(): void {
    this.eh.pubmEvent.subscribe((v) => {
      this.pubm = v;
    });
    this.auth.loggedIn.subscribe(v => {
      this.userValue = v;
    })    
  }
}
