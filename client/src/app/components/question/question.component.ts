import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Topic } from '../../consts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { VoteService } from '@app/services/vote.service';
import { DialogService } from '@app/services/dialog.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input()
  question?: any;
  @Output()
  voteUpdated: EventEmitter<any> = new EventEmitter();
  content?: SafeHtml = '';
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  votes: number = 0;
  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    public auth: AuthenticationService,
    private vote: VoteService,
    private dials: DialogService
  ) {}
  ngOnInit() {
    const v = this.question?.votes;
    if (v.length > 0) {
      let sum = 0;
      for (let vote of v) {
        sum = sum + Number(vote.score);
      }
      this.votes = sum;
    }
  }
  editTopic() {
    const url = `/users/${this.question?.user?.id}/edit-topic/${this.question?.id}`;
    this.router.navigateByUrl(url);
  }
  deleteTopic() {}
  plus() {
    if (!this.validateVote()) return;
    this.votes = this.votes + 1;
    const vote = {
      user: this.auth.userValue?.id,
      topic: this.question?.id,
      score: 1,
    };
    this.vote.create(vote).subscribe((v) => {
      this.voteUpdated.emit();
    });
  }
  minus() {
    if (!this.validateVote()) return;
    this.votes = this.votes - 1;
    const vote = {
      user: this.auth.userValue?.id,
      topic: this.question?.id,
      score: -1,
    };
    this.vote.create(vote).subscribe((v) => {
      this.voteUpdated.emit();
    });
  }
  validateVote() {
    const b1 = this.question?.votes.some(
      (v) => v.user == this.auth.userValue?.id
    );
    const b2 = this.question?.user?.id == this.auth.userValue?.id;
    if (b1) {
	this.dials.showMessDial('Информация','Вы уже проголосовали за эту запись');
    }
    if (b2) {
 	this.dials.showMessDial('Информация','Нельзя голосовать за собственные записи');
    }
    if (b1 || b2) return false;
    return true;
  }
}
