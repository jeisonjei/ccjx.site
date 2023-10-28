import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Tag, Topic } from '@app/consts';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { DialogService } from '@app/services/dialog.service';
import { TopicService } from '@app/services/question.service';
import { TagService } from '@app/services/tag.service';
import { ValidatorService } from '@app/services/validator.service';

@Component({
  selector: 'app-popular-and-not',
  templateUrl: './popular-and-not.component.html',
  styleUrls: ['./popular-and-not.component.scss']
})
export class PopularAndNotComponent implements OnInit{
  tags: Tag[]=[];
  recentQuestions: Topic[] = [];
  nonAnsweredQuestions: Topic[]=[];
  popularArticles: Topic[]=[];
  constructor(private tagService: TagService, private topicService: TopicService, private auth:AuthenticationService,private dials:DialogService,private validator:ValidatorService,private tops:TopicService,private router:Router){}
  ngOnInit(): void {
    this.tagService.list().subscribe((v: any) => {
      this.tags = v;
    });
    this.topicService.listRecent(10).subscribe((v: any) => {
      this.recentQuestions = v;
    });
    this.topicService.listPopularArticles(10).subscribe((v: any) => {
      this.popularArticles = v;
    })
    this.topicService.listNonAnswered(10).subscribe((v: any) => {
      this.nonAnsweredQuestions = v;
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
      this.tops.create(question).subscribe({
        next(value: { user: { id: any; }; id: any; }) {
          const url = `users/${value.user.id}/new-topic/${value.id}`;
          self.router.navigateByUrl(url);
        },
      });
    }
  }

}
