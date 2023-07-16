import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlsService } from '../../services/urls.service';
import { Answer, Topic } from '../../consts';
import { AnswerService } from 'src/app/services/answer.service';
import { AnswerComponent } from 'src/app/components/answer/answer.component';
import { NewAnswerComponent } from 'src/app/components/new-answer/new-answer.component';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from 'ngx-auth';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  question?: Topic;
  comments?: [];
  answers?: [];
  newCommentDisplay: boolean = false;
  newAnswerDisplay: boolean = false;
  answerEdit?: Answer;
  @ViewChild(NewAnswerComponent)
  newAnswerComponent?: NewAnswerComponent;
  editAnswerDisplay: boolean=false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private urls: UrlsService,
    private ans: AnswerService,
    private comms: CommentService,
    private auth: AuthenticationService,
    private dials:DialogService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.getQuestion();
    });
  }

  refreshDisplayState(v: boolean) {
    this.newAnswerDisplay = v;
  }
  refreshEditAnswerDisplayState(v: boolean) {
    this.editAnswerDisplay = v;
  }
  refreshNewCommentDisplayState(v: boolean) {
    this.newCommentDisplay = v;
  }

  getQuestion() {
    const topicId = this.activatedRoute.snapshot.paramMap.get('topicId');
    const url = this.urls.getUrlTopicDetail(topicId??'');
    this.http.get(url).subscribe((v: any) => {
      this.question = v;
      this.answers = v.answers;
      this.comments = v.comments;
    })
  }
  answer() {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация','Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    } else {
      this.newAnswerDisplay = true;
    }
  }
  editAnswer(answer?: Answer) {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация','Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    }
    else {
      this.editAnswerDisplay = true;
      this.answerEdit = answer;
    }
  }
  deleteAnswer(answer?: Answer) {
    this.dials.showDelConfDial("Удаление ответа", "Вы действительно хотите удалить свой ответ?").subscribe(v => {
      this.ans.delete(answer?.id).subscribe(v => {
        this.getQuestion();
      });
    });
  }
  comment() {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация','Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    } else {
      this.newCommentDisplay = true;
    }
  }
}
