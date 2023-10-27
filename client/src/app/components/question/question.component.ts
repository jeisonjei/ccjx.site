import { Component, Input, Output, OnInit, EventEmitter, OnChanges } from '@angular/core';
import { Topic } from '../../consts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { VoteService } from '@app/services/vote.service';
import { DialogService } from '@app/services/dialog.service';
import * as Editor from '@src/assets/ckeditor';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnChanges {
  @Input()
  question?: any;
  @Output()
  voteUpdated: EventEmitter<any> = new EventEmitter();
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  votes: number = 0;
  dateCreated: string = '';
  public Editor = Editor;
  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    public auth: AuthenticationService,
    private vote: VoteService,
    private dials: DialogService
  ) {}
  ngOnInit() {
    
      }
  ngOnChanges(){
this.dateCreated = this.formatDate(this.question?.date_created);
    const v = this.question?.votes;
    if (v.length > 0) {
      let sum = 0;
      for (let vote of v) {
        sum = sum + Number(vote.score);
      }
      this.votes = sum;
    }
    else {
	    this.votes = 0;
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
  formatDate(dateTime:string) {
    let date = new Date(dateTime);
      return Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Moscow',
        timeZoneName: 'short',
      }).format(date);
  }

}
