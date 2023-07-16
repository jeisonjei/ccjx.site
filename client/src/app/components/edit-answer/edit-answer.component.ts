import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Answer } from '@app/consts';
import { AnswerService } from '@app/services/answer.service';

@Component({
  selector: 'app-edit-answer',
  templateUrl: './edit-answer.component.html',
  styleUrls: ['./edit-answer.component.scss']
})
export class EditAnswerComponent implements OnInit{
  @Input()
  answer?: any;
  @Output()
  public display: EventEmitter<boolean> = new EventEmitter();
  @Output()
  public updated: EventEmitter<boolean> = new EventEmitter();
  constructor(private ans:AnswerService) { }
  ngOnInit(): void {
    
  }

  updateAnswer(content: string) {
    const answer: Answer = {
      id: this.answer?.id,
      topic: this.answer?.topic,
      user: this.answer?.user?.id,
      text: content
    }
    this.ans.update(answer).subscribe(v => {
      this.display.emit(false);
      this.updated.emit(true);
    });
  }
  hideForm() {
    this.display.emit(false);
  }

}
