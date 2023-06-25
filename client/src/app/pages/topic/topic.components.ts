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
    this.activatedRoute.paramMap.subscribe(() => {
      this.getQuestion();
    });
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
    this.http.get(url).subscribe((v: any) => {
      this.question = v;
      this.answers = v.answers;
      this.comments = v.comments;
    })
  }
  answer() {
    this.newAnswerDisplay = true;
  }
  comment() {
    this.newCommentDisplay = true;
  }
}
