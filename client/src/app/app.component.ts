import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Topic } from "./consts";
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService, LoginInfo } from './services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './services/error-handler.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'client';
  pubm?: string;
  constructor(private http: HttpClient,public auth:AuthenticationService,private router:Router,private eh:ErrorHandlerService) {
    
  }

  
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
