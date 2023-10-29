import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Answer } from '../../consts';
import { Comment } from '@app/consts';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentService } from '@app/services/comment.service';
import { VoteService } from '@app/services/vote.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import * as Editor from '@src/assets/ckeditor';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent implements OnInit {

  @Input()
  answer?: any;
  @Output()
  commentCreated: EventEmitter<boolean> = new EventEmitter();
  @Output()
  onEdit: EventEmitter<any> = new EventEmitter();
  @Output()
  onDelete: EventEmitter<Answer> = new EventEmitter();
  @Output()
  voteUpdated: EventEmitter<any> = new EventEmitter();
  votes: number = 0;
  newCommentDisplay: boolean=false;
  editCommentDisplay: boolean=false;
  comments: Comment[] = [];
  commentEdit: any;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  public Editor = Editor;
  constructor(
    public auth: AuthenticationService,
    private dials: DialogService,
    public sanitizer: DomSanitizer,
    public comms:CommentService,
    private vote: VoteService,
  ) {}
  ngOnInit(): void {
    this.comments = this.answer.comments;
    const v = this.answer?.votes;
    if (v.length > 0) {
      let sum = 0;
      for (let vote of v) {
        sum = sum + Number(vote.score);
      }
      this.votes = sum;
    }
  }
  comment() {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial(
        'Информация',
        'Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться'
      );
    } else {
      this.newCommentDisplay = true;
    }
  }
  editComment(comment?: Comment) {
    console.log(`🔥 comment: ${JSON.stringify(comment)}`);
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация','Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    }
    else {
      this.editCommentDisplay = true;
      this.commentEdit = comment;
    }
  }
  deleteComment(comment?: Comment) {
    this.dials.showDelConfDial("Удаление комментария", "Вы действительно хотите удалить свой комментарий?").subscribe(v => {
      if (v) {
        this.comms.delete(comment?.id).subscribe(v => {
          this.refresh();
        })
      }
    })
  }
  refresh() {
    this.newCommentDisplay = false;
    this.commentCreated.emit();
  }
  refreshNewCommentDisplayState(v: boolean) {
    this.newCommentDisplay = v;
  }
  refreshEditCommentDisplayState(v: boolean) {
    this.editCommentDisplay = v;
  }
 plus() {
    if (!this.validateVote()) return;
    this.votes = this.votes + 1;
    const vote = {
      user: this.auth.userValue?.id,
      answer: this.answer?.id,
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
      answer: this.answer?.id,
      score: -1,
    };
    this.vote.create(vote).subscribe((v) => {
      this.voteUpdated.emit();
    });
  }
  validateVote() {
    const b1 = this.answer?.votes.some(
      (v) => v.user == this.auth.userValue?.id
    );
    const b2 = this.answer?.user?.id == this.auth.userValue?.id;
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
