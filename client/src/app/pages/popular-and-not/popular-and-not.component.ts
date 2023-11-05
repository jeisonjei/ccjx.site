import { Component, OnInit } from '@angular/core';
import { MatChipListboxChange } from '@angular/material/chips';
import { Route, Router } from '@angular/router';
import { Tag, Topic } from '@app/consts';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { DialogService } from '@app/services/dialog.service';
import { TopicService } from '@app/services/topic.service';
import { TagService } from '@app/services/tag.service';
import { ValidatorService } from '@app/services/validator.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-popular-and-not',
  templateUrl: './popular-and-not.component.html',
  styleUrls: ['./popular-and-not.component.scss']
})
export class PopularAndNotComponent implements OnInit{
  tags: Tag[]=[];
  recentQuestions: Topic[] = [];
  nonAnsweredQuestions: Topic[]=[];
  popularArticles: Topic[] = [];
  selectedTags:any[]=[];
  constructor(private tagService: TagService, private topicService: TopicService, private auth:AuthenticationService,private dials:DialogService,private validator:ValidatorService,private tops:TopicService,private router:Router,private titleService:Title){}
  ngOnInit(): void {
    this.tagService.list().subscribe((v: any) => {
      this.tags = v.sort((a,b)=>a.name.localeCompare(b.name));
    });
    this.refreshData();
    this.titleService.setTitle('ccjx Блокнот');
  }
  refreshData() {
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
  refreshDataWithTags(tags:string[]) {
    this.topicService.listRecentByTag(10,tags).subscribe((v: any) => {
      this.recentQuestions = v;
    });
    this.topicService.listPopularArticlesByTag(10,tags).subscribe((v: any) => {
      this.popularArticles = v;
    })
    this.topicService.listNonAnsweredByTag(10,tags).subscribe((v: any) => {
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
  onChipSelect(event: MatChipListboxChange) {
    const tags = event.source.value;
    if (tags==0) {
      this.refreshData();
    }
    else {
      this.refreshDataWithTags(tags);
    }
  }
}
