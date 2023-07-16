import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Answer } from '../../consts';
import { Comment } from '@app/consts';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentService } from '@app/services/comment.service';

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
  newCommentDisplay: boolean=false;
  editCommentDisplay: boolean=false;
  comments: Comment[] = [];
  commentEdit: any;
  constructor(
    public auth: AuthenticationService,
    private dials: DialogService,
    public sanitizer: DomSanitizer,
    public comms:CommentService
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
  refreshEditCommentDisplayState(v: boolean) {
    this.editCommentDisplay = v;
  }

}
