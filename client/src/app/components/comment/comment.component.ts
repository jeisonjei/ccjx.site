import { Component, Input, Output } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input()
  comment?: any;
  constructor(public auth:AuthenticationService, public sanitizer: DomSanitizer) { }
  @Output()
  onEdit: EventEmitter<any> = new EventEmitter();
  @Output()
  onDelete: EventEmitter<any> = new EventEmitter();
}
