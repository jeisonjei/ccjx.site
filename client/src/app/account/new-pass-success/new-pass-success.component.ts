import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-pass-success',
  templateUrl: './new-pass-success.component.html',
  styleUrls: ['./new-pass-success.component.scss']
})
export class NewPassSuccessComponent implements OnInit{
  public userEmail: string | undefined;
  constructor(private route:ActivatedRoute){}
  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.userEmail = params['userEmail'];
      }
    );
  }


}
