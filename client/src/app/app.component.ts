import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Consts } from "./consts";
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService, LoginInfo } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'client';
  c: Consts = new Consts();
  constructor(private http: HttpClient,public auth:AuthenticationService) {
    console.log(`=== auth.cu: ${JSON.stringify(auth.cu)}`);
  }
  logout() {
    this.auth.logout();
  }
}
