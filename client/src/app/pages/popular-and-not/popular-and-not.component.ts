import { Component, OnInit } from '@angular/core';
import { Tag, Topic } from '@app/consts';
import { TopicService } from '@app/services/question.service';
import { TagService } from '@app/services/tag.service';

@Component({
  selector: 'app-popular-and-not',
  templateUrl: './popular-and-not.component.html',
  styleUrls: ['./popular-and-not.component.scss']
})
export class PopularAndNotComponent implements OnInit{
  tags: Tag[]=[];
  recentQuestions:Topic[]=[];
constructor(private tagService:TagService, private topicService:TopicService){}
  ngOnInit(): void {
    this.tagService.list().subscribe((v: any) => {
      this.tags = v;
    });
    this.topicService.listRecent(10).subscribe((v: any) => {
      this.recentQuestions = v;
    })
  }
}
