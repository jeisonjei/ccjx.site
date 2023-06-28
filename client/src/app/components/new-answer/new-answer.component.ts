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
  @Output()
  public display: EventEmitter<boolean> = new EventEmitter();
  @Output()
  public created: EventEmitter<boolean> = new EventEmitter();
  constructor(private arouter: ActivatedRoute,private auth:AuthenticationService,private answer:AnswerService) {

   }
  addAnswer(form: NgForm) {
    const questionId = this.arouter.snapshot.paramMap.get('questionId');
    const userId = this.auth.cu?.id??'';
    const text = form.value.text;
    const answer :Answer= {
      question: questionId??'',
      user: userId,
      text: text,
    };
    this.answer.create(answer).subscribe((v) => {
      this.display.emit(false);
      this.created.emit(true);
    });
  }
  hideForm() {
    this.display.emit(false);
  }
}
