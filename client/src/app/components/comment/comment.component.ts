import { Component, Input, Output } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Editor from '@src/assets/ckeditor';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input()
  comment?: any;
  public Editor = Editor;
  constructor(public auth:AuthenticationService, public sanitizer: DomSanitizer) { }
  @Output()
  onEdit: EventEmitter<any> = new EventEmitter();
  @Output()
  onDelete: EventEmitter<any> = new EventEmitter();
}
