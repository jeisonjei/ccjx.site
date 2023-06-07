import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EMPTY, catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/services/errors/error-handler.service';
import { Consts } from 'src/app/consts';
const baseUrl = { location };

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  c: Consts = new Consts();
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandlerService) {
    errorHandler.pubmEvent.subscribe(
      (pubm) => {
        this.pubm = pubm;
      }
    )
   }
  pubm: string | undefined;
  showWarning: boolean = false;
  waiting: boolean = false;
  register(f: FormControl): void {
    let url = this.c.URL_REGISTER;
    let postObservable = this.http.post(url, f);
    this.waiting = true;
    postObservable.subscribe({
      next:(data) => {
        this.router.navigateByUrl('/account/register/confirmation');
        this.waiting = false;
      },
      error: (error) => {
        this.showWarning = true;
        this.errorHandler.handleError(error);
        this.waiting = false;
      }
  });
  }
}
