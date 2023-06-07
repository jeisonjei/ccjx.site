import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Consts } from "../../consts";
import { ErrorHandlerService } from '../../services/errors/error-handler.service';

@Component({
  selector: 'app-new-pass-request',
  templateUrl: './new-pass-request.component.html',
  styleUrls: ['./new-pass-request.component.scss']
})
export class NewPassRequestComponent {
  c: Consts = new Consts();
  public pubm: string ='';
  public showWarning: boolean = false;
  waiting: boolean = false;
  constructor(private http: HttpClient, private router: Router, private eh: ErrorHandlerService) {
    eh.pubmEvent.subscribe(
      (v) => {
        this.pubm = v;
      }
    )
  }
  sendEmail(f: FormControl): void{
    this.waiting = true;
    this.http.post(this.c.URL_SEND_EMAIL_NEW_PASS, f, { withCredentials: true }).subscribe({
      next: (data) => {
        this.router.navigateByUrl('/account/new-pass-email-sent');
        this.waiting = false;
      },
      error: (error) => {
        this.showWarning = true;
        this.eh.handleError(error);
        this.waiting = false;
      }
    })
  }
}
