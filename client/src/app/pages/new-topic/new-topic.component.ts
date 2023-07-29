import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { UrlsService } from '../../services/urls.service';
import { Tag, Topic as Topic } from '../../consts';
import { TopicService } from 'src/app/services/question.service';
import { TagService } from '@app/services/tag.service';
import { Observable, map, startWith } from 'rxjs';
import { faTag  } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.scss'],
})
export class NewQuestionComponent implements OnInit {
  faTag = faTag;
  title: string='';
  topicId: string='';
  userId: string = '';
  isArticle: boolean = false;
  isPrivate: boolean = false;
  myControl: FormControl=new FormControl('');
  tags: any[]=[];
  tagsFiltered?: Observable<any[]>;
  tagsAdded: any[]=[];
  tagSelected:any =null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private urls: UrlsService,
    private quess: TopicService,
    private tagService: TagService) {
    
  }
  ngOnInit(): void {
    this.getTopic();
    this.selectTitle();
    this.tagList();
    this.tagsFiltered = this.myControl.valueChanges.pipe(
      startWith(''),
      map(v => this._filter(v || ''))
    );
  }
  private _filter(v: any): any {
    if (typeof (v) == 'object') {
      // при выборе элемента сюда передаётся объект тэг. В этом случае возврат
      return;
    }
    const filterValue = v.toLowerCase(); 
    return this.tags.filter(v=>v.name.toLowerCase().includes(filterValue));
  }
  selectTitle() {
    const topic = document.getElementById('topic') as HTMLInputElement;
    topic?.focus();
  }
  getTopic() {
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    const topicId = this.activatedRoute.snapshot.paramMap.get('topicId');
    this.userId = userId??'';
    this.topicId = topicId??'';
    const url = this.urls.getUrlTopicDetail(topicId??'Error');
    const self = this;
    this.http.get(url).subscribe({
      next(value: any) {
        self.title = value.title != undefined ? value.title : 'Новая запись';
        self.tagsAdded = value.tags;
      },
    });
  }
  addQuestion(content: string) {
    const title = this.title;
    const text = content;
    const topicId = this.activatedRoute.snapshot.paramMap.get('topicId');
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    const t: Topic = {
      user: userId??'Error',
      title: title,
      text: text,
      is_article: this.isArticle,
      is_private:this.isPrivate
    };
    const serverUrl = this.urls.getUrlTopicDetail(topicId??'Error');
    const self = this;
    console.log(`🔥 topic: ${JSON.stringify(t)}`);
    this.http.patch(serverUrl, t).subscribe({
      next(value) {
        
      },
    }); 
    const url = `topics/${topicId}`;
    this.router.navigateByUrl(url);
  }
  cancel() {
    console.log(`🔥 : ${this.cancel.name}`);
    this.quess.delete(this.topicId??'').subscribe();
    this.router.navigateByUrl('');
  }
  handleTopicChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.title = value;
  }
  onIsArticleChange(checked: boolean) {
    this.isArticle = checked;
  } 
  onIsPrivateChange(checked: boolean) {
    this.isPrivate = checked;
  }
  tagList() {
    this.tagService.list().subscribe((v:any) => {
      this.tags = v;
    })    
  }
  tagCreate(tagName: string) {
    if (!this.tags.map(v=>v.name).includes(tagName)) {
      // создать новый тэг
      const tag:Tag = {
        name: tagName,
        topics: [this.topicId]
      }
      this.tagService.create(tag).subscribe(v => {
        this.tagsAdded.push(v);
      });
    }
    else {
      // получить id существующего тэга
      let tag = this.tags.filter(v => v.name === tagName)[0];
      tag.topics.push(Number.parseInt(this.topicId));
      this.tagsAdded.push(tag);
      this.tagService.updateMany(this.tagsAdded)
    }
    this.myControl.reset();
  }
  tagAddOnEnter(event: Event) {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key != "Enter") return;
    const inputField = event.target as HTMLInputElement;
    const v = inputField.value;
    this.tagCreate(v);
  }
  tagDelete(tag: Tag) {
    const index = tag.topics.findIndex(v=>v==this.topicId);
    tag.topics.splice(index,1);
    console.log(`🔥 tag: ${JSON.stringify(tag)}`);
    this.tagService.deleteFromTopic(tag?.id??'error',{topics:tag.topics}).subscribe(v => {
      this.getTopic();
    })
  }
  tagSelectionChange(event: Event) {
    const inputField = event.target as HTMLInputElement;
    const v = inputField.value;
  }
  displayFn(tag: any) {
    return tag && tag.name ? tag.name : '';
  }

}
