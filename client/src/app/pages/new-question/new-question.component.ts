import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { UrlsService } from '../../services/urls.service';
import { Question } from '../../consts';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.scss'],
})
export class NewQuestionComponent implements OnInit {
  topic?: string;
  questionId?: string;
  userId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private urls: UrlsService,
    private quess:QuestionService
  ) {}
  ngOnInit(): void {
    this.getTopic();
  }
  getTopic() {
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    const questionId = this.activatedRoute.snapshot.paramMap.get('questionId');
    this.userId = userId ?? '';
    this.questionId = questionId??'';
    if (userId == undefined || questionId == undefined) {
      console.error('Не задан userId или questionId');
      this.router.navigateByUrl('');
      return;
    }
    const url = this.urls.getNewQuestionDetailUrl(userId, questionId);
    const self = this;
    this.http.get(url).subscribe({
      next(value: any) {
        self.topic = value.topic != undefined ? value.topic : 'Новый вопрос';
      },
    });
  }
  addQuestion(value: any) {
    const topic = this.topic;
    const text = value.text;
    const questionId = this.activatedRoute.snapshot.paramMap.get('questionId');
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    if (userId == undefined || questionId == undefined) {
      console.error(
        'Переменная userId==undefined или переменная questionId==undefined'
      );
      return;
    }
    const q: Question = {
      user: {id:userId == undefined ? '' : userId},
      topic: topic == undefined ? '' : topic,
      text: text,
    };
    const serverUrl = this.urls.getNewQuestionDetailUrl(userId, questionId);
    const self = this;
    this.http.patch(serverUrl, q).subscribe({
      next(value) {
        
      },
    });
    const url = `question/${questionId}`;
    this.router.navigateByUrl(url);
  }
  cancel() {
    this.quess.delete(this.questionId??'').subscribe();
    this.router.navigateByUrl('');
  }
}
