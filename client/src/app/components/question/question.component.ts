import { Component, Input, OnInit } from '@angular/core';
import { Topic } from '../../consts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit{
  @Input()
  question?: any;
  content?: SafeHtml = '';
  faArrowUp=faArrowUp;
  faArrowDown=faArrowDown;
  votes: number = 0;
  constructor(public sanitizer: DomSanitizer,private router: Router, public auth:AuthenticationService) {
   }
  ngOnInit() {
	let sum = 0;
	for(let vote of this.question?.votes){
		sum = sum + vote.score;
	}
	this.votes = sum;
   }
  editTopic() {
    const url = `/users/${this.question?.user?.id}/edit-topic/${this.question?.id}`;
    this.router.navigateByUrl(url);
  }
  deleteTopic() {
    
  }
  plus() {
    this.question.scores=this.question.scores+1;
  }
  minus() {
    this.question.scores=this.question.scores-1;
  }
}
