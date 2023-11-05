import { HttpClient } from '@angular/common/http';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlsService } from '../../services/urls.service';
import { Answer, Comment, Topic } from '../../consts';
import { AnswerService } from 'src/app/services/answer.service';
import { AnswerComponent } from 'src/app/components/answer/answer.component';
import { NewAnswerComponent } from 'src/app/components/new-answer/new-answer.component';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from 'ngx-auth';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { TopicService } from '@app/services/topic.service';
import { ValidatorService } from '@app/services/validator.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  @Input()
  idForRandom?: string;
  question?: Topic;
  comments?: [];
  answers?: [];
  newCommentDisplay: boolean = false;
  newAnswerDisplay: boolean = false;
  answerEdit?: Answer;
  @ViewChild(NewAnswerComponent)
  newAnswerComponent?: NewAnswerComponent;
  editAnswerDisplay: boolean = false;
  editCommentDisplay: boolean = false;
  commentEdit: Comment | undefined;
  lastTopics:any[]=[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private urls: UrlsService,
    private ans: AnswerService,
    private comms: CommentService,
    private auth: AuthenticationService,
    private dials: DialogService,
    public topicService: TopicService,
    private router: Router,
    private validator: ValidatorService,
    private titleService:Title
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.getQuestion();
    });
    this.topicService.listRecent(10).subscribe((v:any) => {
      this.lastTopics = v;
    })
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
  refreshEditCommentDisplayState(v: boolean) {
    this.editCommentDisplay = v;
  }

  getQuestion() {

    const topicSlug = this.activatedRoute.snapshot.paramMap.get('topicSlug');
    this.topicService.retrieve(topicSlug??'error').subscribe((v:any) => {
      this.question = v;
      this.answers = v.answers;
      this.comments = v.comments;          
      this.titleService.setTitle(this.question?.title??'error');
    })
  }
  answer() {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация', 'Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    } else {
      this.newAnswerDisplay = true;
    }
  }
  editAnswer(answer?: Answer) {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация', 'Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    }
    else {
      this.editAnswerDisplay = true;
      this.answerEdit = answer;
    }
  }
  deleteAnswer(answer?: Answer) {
    this.dials.showDelConfDial("Удаление ответа", "Вы действительно хотите удалить свой ответ?").subscribe(v => {
      if (v) {
        this.ans.delete(answer?.id).subscribe(v => {
          this.getQuestion();
        });
      }
    });
  }
  comment() {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация', 'Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    } else {
      this.newCommentDisplay = true;
    }
  }
  editComment(comment?: Comment) {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация', 'Чтобы добавить ответ или оставить комментарий, нужно зарегистрироваться');
    }
    else {
      this.editCommentDisplay = true;
      this.commentEdit = comment;
    }
  }
  deleteComment(comment?: Comment) {
    this.dials.showDelConfDial("Удаление комментария", "Вы действительно хотите удалить свой комментарий?").subscribe(v => {
      if (v) {
        this.comms.delete(comment?.id).subscribe(v => {
          this.getQuestion();
        })
      }
    })
  }
  onQuestion(value: string) {
    if (!this.auth.userValue?.isLoggedIn) {
      this.dials.showMessDial('Информация','Чтобы создавать вопросы, нужно зарегистрироваться');
    }
    else{
      if (!this.validator.text(value)) return;
      const userId = this.auth.userValue?.id;
      const question: Topic = {
        user: userId,
        title: value
      };
      const self = this;
      this.topicService.create(question).subscribe({
        next(value: { user: { id: any; }; slug: any; }) {
          const url = `users/${value.user.id}/new-topic/${value.slug}`;
          self.router.navigateByUrl(url);
        },
      });
    }
  }

}
