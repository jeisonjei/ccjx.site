import { Component, Input } from '@angular/core';
import { Topic } from '../../consts';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input()
  question?: any;
}
