import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Comment } from '@app/consts';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { CommentService } from '@app/services/comment.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {
  @Input()
  relatedItem: any = '';
  @Input()
  comment?: any;
  @Output()
  display: EventEmitter<boolean> = new EventEmitter();
  @Output()
  updated: EventEmitter<boolean> = new EventEmitter();
  constructor(public auth:AuthenticationService,private coms:CommentService) { }

  updateComment(content: string) {
    const type = this.relatedItem?.type;
    const relId = this.relatedItem?.id;
    if (type=='question') {
      const comm: Comment = {
        id: this.comment?.id,
        user: this.comment?.user?.id??'error',
        topic: relId,
        text: content
      }
      this.coms.update(comm).subscribe(() => {
        this.updated.emit(true);
        this.display.emit(false);
      });
    }
    else if (type=='answer') {
      const comm: Comment = {
        id: this.comment?.id,
        user: this.comment?.user?.id??'error',
        answer:relId,
        text:content
      }
      this.coms.update(comm).subscribe(() => {
        this.updated.emit(true);
        this.display.emit(false);
      });
    }
  }
  hideForm() {
    this.display.emit(false);
  }
}
