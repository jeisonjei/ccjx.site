import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EMPTY, catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UrlsService } from 'src/app/services/urls.service';
const baseUrl = { location };

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent{
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private eh: ErrorHandlerService,
  private urls:UrlsService) {
    eh.pubmEvent.subscribe(
      (v) => {
        this.pubm = v;
      }
    )
   }
  pubm: string | undefined;
  showWarning: boolean = false;
  waiting: boolean = false;
  register(f: FormControl): void {
    let url = this.urls.URL_REGISTER;
    let postObservable = this.http.post(url, f);
    this.waiting = true;
    postObservable.subscribe({
      next:(data) => {
        this.router.navigateByUrl('/account/register/confm');
        this.waiting = false;
      },
      error: (error) => {
        this.showWarning = true;
        this.eh.handleError(error.error);
        this.waiting = false;
      }
  });
  }
}
