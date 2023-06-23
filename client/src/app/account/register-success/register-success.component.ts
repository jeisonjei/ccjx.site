import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, ErrorHandler, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UrlsService } from 'src/app/services/urls.service';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss'],
})
export class RegisterSuccessComponent implements OnInit {
  public pubm: string | undefined;
  public isSuccesful: boolean = true;
  public userEmail: string | undefined;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private eh: ErrorHandlerService,
    private urls:UrlsService
  ) {
    this.eh.pubmEvent.subscribe((v) => {
      this.pubm = v;
    });
  }
  ngOnInit(): void {
    let token: string | undefined;
    this.route.params.subscribe((params) => {
      token = params['token'];
    });
    let url = `${this.urls.URL_EMAIL_VERIFICATION}${token}`;
    this.http.get(url).subscribe({
      next: (data) => {
        this.isSuccesful = true;
        this.userEmail = data.toString();
      },
      error: (error) => {
        this.isSuccesful = false;
        this.eh.handleError(error.error);
      },
    });
  }
}
