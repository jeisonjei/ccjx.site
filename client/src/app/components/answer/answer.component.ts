import { Component, Input, OnInit, Output } from '@angular/core';
import { Answer } from '../../consts';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit{
  @Input()
  answer?:any
  ngOnInit(): void {
    
  }

}
