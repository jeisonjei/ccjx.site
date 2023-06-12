import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlsService } from '../urls.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  topic?: string;
  text?: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private urls:UrlsService
  ) {}
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((v) => {
      this.getQuestion();
    })
  }
  getQuestion() {
    const questionId = this.activatedRoute.snapshot.paramMap.get('questionId');
    const url = this.urls.getQuestionDetailUrl(
      questionId == null ? '' : questionId
    );
    const self = this;
    this.http.get(url).subscribe({
      next(value: any) {
        self.topic = value.topic;
        self.text = value.text;
      },
    });
  }
}
