import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/errors/error-handler.service';
import { UrlsService } from 'src/app/urls.service';

interface NewPassCredentials {
  token: string | undefined;
  newPassword: string | undefined;
  newPasswordConfirmation: string | undefined;
}

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.scss'],
})
export class NewPassComponent {
  public token: string | undefined;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private eh: ErrorHandlerService,
    private urls:UrlsService
  ) {
    let userEmail: string | undefined;
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
    eh.pubmEvent.subscribe((v) => {
      this.pubm = v;
    });
  }
  pubm: string = '';
  showWarning: boolean = false;
  waiting: boolean = false;
  sendForm(f: FormControl): void {
    this.waiting = true;
    this.http.post(this.urls.URL_NEW_PASS, f).subscribe({
      next: (data) => {
        this.router.navigateByUrl(`/account/new-pass-success/${data}`);
        this.waiting = false;
      },
      error: (error) => {
        this.showWarning = true;
        this.eh.handleError(error);
        this.waiting = false;
      },
    });
  }
}
