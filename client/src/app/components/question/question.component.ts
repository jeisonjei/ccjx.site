import { Component, Input, OnInit } from '@angular/core';
import { Topic } from '../../consts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { VoteService } from "@app/services/vote.service";

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
  constructor(public sanitizer: DomSanitizer,private router: Router, public auth:AuthenticationService, private vote: VoteService) {
   }
  ngOnInit() {
	  const v = this.question?.votes;
	  if(v.length>0){
		  let sum = 0;
	 	for(let vote of v){
			sum = sum + Number(vote.score);
		}	
		this.votes = sum;
	  }
   }
   editTopic() {
    const url = `/users/${this.question?.user?.id}/edit-topic/${this.question?.id}`;
    this.router.navigateByUrl(url);
  }
  deleteTopic() {
    
  }
  plus() {
  	this.votes=this.votes+1;
	const vote = {
		user: this.auth.userValue?.id,
		topic: this.question?.id,
		score: 1
	}
       this.vote.create(vote).subscribe();
  }
  minus() {
    this.votes = this.votes -1;
    const vote = {
    	user: this.auth.userValue?.id,
	topic: this.question?.id,
	score: -1
    };
    this.vote.create(vote).subscribe();
	
  }
}
