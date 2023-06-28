import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Answer } from '../../consts';
import { Comment } from '@angular/compiler';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit{
  @Input()
  answer?: any
  @Output()
  commentCreated: EventEmitter<boolean> = new EventEmitter;
  newCommentDisplay?: boolean;
  comments:Comment[]=[];
  ngOnInit(): void {
    this.comments = this.answer.comments;

  }
  comment() {
    this.newCommentDisplay = true;
  }
  refresh() {
    this.newCommentDisplay = false;
    this.commentCreated.emit();
  }
}
