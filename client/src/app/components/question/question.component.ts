import { Component, Input, OnInit } from '@angular/core';
import { Topic } from '../../consts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent{
  @Input()
  question?: any;
  content?:SafeHtml='';
  constructor(public sanitizer: DomSanitizer) {
   }
  editTopic() {
     
  }
  deleteTopic() {
    
  }
}
