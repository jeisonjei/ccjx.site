import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Answer } from 'src/app/consts';
import { AnswerService } from 'src/app/services/answer.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-new-answer',
  templateUrl: './new-answer.component.html',
  styleUrls: ['./new-answer.component.scss']
})
export class NewAnswerComponent {
  @Input()
  answer?:Answer;
  @Output()
  public display: EventEmitter<boolean> = new EventEmitter();
  @Output()
  public created: EventEmitter<boolean> = new EventEmitter();
  modules = {};
  content = '';
  constructor(private arouter: ActivatedRoute,private auth:AuthenticationService,private ans:AnswerService) {
    
   }
  addAnswer(content: string) {
    
    const param = this.arouter.snapshot.paramMap.get('topicSlug');
    const topicId = param?.split('-')[0];
    const userId = this.auth.userValue?.id??'';
    const text = content;
    const answer :Answer= {
      topic: topicId??'',
      user: userId,
      text: text,
    };
    this.ans.create(answer).subscribe((v) => {
      this.display.emit(false);
      this.created.emit(true);
    });
  }
  hideForm() {
    this.display.emit(false);
  }
}
