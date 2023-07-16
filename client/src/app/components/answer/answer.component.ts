import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Answer } from '../../consts';
import { Comment } from '@angular/compiler';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  newCommentDisplay?: boolean;
  comments: Comment[] = [];
  constructor(
    private auth: AuthenticationService,
    private dials: DialogService,
    public sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.comments = this.answer.comments;
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
  refresh() {
    this.newCommentDisplay = false;
    this.commentCreated.emit();
  }
  edit() {
  throw new Error('Method not implemented.');
  }
  del() {
    throw new Error('Method not implemented.');
    }
}
