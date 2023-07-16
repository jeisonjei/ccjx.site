import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {
  @Input()
  relatedItem:any='';
  @Output()
  display: EventEmitter<boolean> = new EventEmitter();
  @Output()
  updated: EventEmitter<boolean> = new EventEmitter();
  
}
