import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlsService } from '../urls.service';
import { Answer, Question } from '../consts';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.scss'],
})
export class QuestionPageComponent implements OnInit {
  question?: Question;
  answers?:Answer[];
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
        self.question = value;
      },
    });
  }
}
