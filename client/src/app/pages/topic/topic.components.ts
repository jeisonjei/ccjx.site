import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlsService } from '../../services/urls.service';
import { Answer, Question } from '../../consts';
import { AnswerService } from 'src/app/services/answer.service';
import { AnswerComponent } from 'src/app/components/answer/answer.component';
import { NewAnswerComponent } from 'src/app/components/new-answer/new-answer.component';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  question?: Question;
  comments?: [];
  answers?: [];
  newCommentDisplay: boolean = false;
  newAnswerDisplay: boolean = false;
  @ViewChild(NewAnswerComponent)
  newAnswerComponent?: NewAnswerComponent;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private urls: UrlsService,
    private ans: AnswerService,
    private comms:CommentService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((v) => {
      this.getQuestion();
    });
    this.refreshAnswers();
    this.refreshComments();
  }
  refreshAnswers() {
    const questionId = this.activatedRoute.snapshot.paramMap.get('questionId');
    this.ans.list(questionId??'').subscribe((v: any) => {
      this.answers = v;
    })

  }
  refreshComments() {
    this.comms.list().subscribe((v: any) => {
      this.comments = v;
    })
  }
  refreshDisplayState(v: boolean) {
    this.newAnswerDisplay = v;
  }
  refreshNewCommentDisplayState(v: boolean) {
    this.newCommentDisplay = v;
  }

  getQuestion() {
    const questionId = this.activatedRoute.snapshot.paramMap.get('questionId');
    const url = this.urls.getQuestionDetailUrl(questionId??'');
    const self = this;
    this.http.get(url).subscribe({
      next(value: any) {
        console.log(`=== value: ${JSON.stringify(value)}`);
        self.question = value;
      },
    });
  }
  answer() {
    this.newAnswerDisplay = true;
  }
  comment() {
    this.newCommentDisplay = true;
  }
}
