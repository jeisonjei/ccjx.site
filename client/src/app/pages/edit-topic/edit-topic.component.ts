import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '@app/services/topic.service';
import { UrlsService } from '@app/services/urls.service';
import { Tag, Topic } from "@app/consts";
import { TagService } from '@app/services/tag.service';
import { Observable, map, startWith } from 'rxjs';
import { faTag  } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss'],
})

export class EditTopicComponent implements OnInit, AfterViewInit {
  faTag = faTag;
  title = '';
  userId = '';
  topicId = '';
  content = '123';
  isArticle: boolean=false;
  isPrivate: boolean=false;
  myControl: FormControl=new FormControl('');
  tags: any[]=[];
  tagsFiltered?: Observable<any[]>;
  tagsAdded: any[]=[];
  tagSelected: any = null;
  markdownSelected='';
  constructor(
    private activatedRoute: ActivatedRoute,
    private topicService: TopicService,
    private router: Router,
    private urls: UrlsService,
    private tagService: TagService
  ) {}
  ngAfterViewInit(): void {
    
  }
  ngOnInit(): void {
    this.getTopic();
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
  getTopic() {
    this.userId =
      this.activatedRoute.snapshot.paramMap.get('userId') ?? 'error';
    this.topicId =
      this.activatedRoute.snapshot.paramMap.get('topicId') ?? 'error';
    this.topicService.retrieve(this.topicId).subscribe((v: any) => {
      this.title = v.title;
      this.content = v.text;
      this.isArticle = v.is_article;
      this.isPrivate = v.is_private;
      this.tagsAdded = v.tags;
    });
  }
  edit(content: string) {
    const topic: Topic = {
      id: this.topicId,
      user: this.userId,
      title: this.title,
      text: content,
      is_article: this.isArticle,
      is_private: this.isPrivate
    }
    this.topicService.update(this.topicId,topic).subscribe(() => {
      const url = `/topics/${this.topicId}`;
      this.router.navigateByUrl(url);
    });
  }
  cancel() {
    const url = `/topics/${this.topicId}`;
    this.router.navigateByUrl(url);
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
        is_private:false,
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
