import { Component, Input, OnInit, Output } from '@angular/core';
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
  newCommentDisplay?: boolean;
  comments:Comment[]=[];
  ngOnInit(): void {
    
  }
  comment() {
    this.newCommentDisplay = true;
  }
}
