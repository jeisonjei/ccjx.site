import { Component, NgZone, OnInit } from '@angular/core';
import { AuthenticationService, LoginInfo } from '../../services/authentication/authentication.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-display',
  templateUrl: './login-display.component.html',
  styleUrls: ['./login-display.component.scss']
})
export class LoginDisplayComponent implements OnInit{
  pubm?: string;
  userValue?: LoginInfo|null;
  constructor(public auth: AuthenticationService, private eh: ErrorHandlerService, private http: HttpClient, private ngZone: NgZone) {
  }
  ngOnInit(): void {
    this.eh.pubmEvent.subscribe((v) => {
      this.pubm = v;
    });
    this.auth.loggedIn.subscribe(v => {
      this.userValue = v;
    })    
  }
  
}
