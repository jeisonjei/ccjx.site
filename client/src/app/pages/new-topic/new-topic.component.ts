import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { UrlsService } from '../../services/urls.service';
import { Tag, Topic as Topic } from '../../consts';
import { TopicService } from '@app/services/topic.service';
import { TagService } from '@app/services/tag.service';
import { Observable, map, startWith } from 'rxjs';
import { faTag  } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { error } from 'console';

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
    private tagService: TagService,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef) {

  }
  @HostListener('window:beforeunload',['$event'])
  onBeforeUnload(event: Event) {
    event.preventDefault();
    event.returnValue = false;
  }
  @HostListener('window:unload',['$event'])
  onUnload(event: Event) {
    fetch(this.urls.getQuestionDeleteUrl(this.topicId), { method: 'DELETE', keepalive: true }).then().catch(error => {
      console.error(error);
    })
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
    this.http.patch(serverUrl, t).subscribe({
      next(value) {

      },
    });
    const url = `topics/${topicId}`;
    this.router.navigateByUrl(url);
  }
  cancel() {
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
    this.tagService.listMy().subscribe((v: any) => {
      this.tags = v;
    })
  }
  tagCreate(tagName: string) {
    if (!this.tags.map(v=>v.name).includes(tagName)) {
      // создать новый тэг
      const tag:Tag = {
        name: tagName,
        is_private:false,
        user: this.auth.userValue?.id,
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
  makeTagPrivate(tag: Tag) {
    let backgroundColor: string = '';
    let is_private = false;
    if (tag.is_private) {
      is_private = false;
      backgroundColor = '#e0e0e0';
    }
    else {
      is_private = true;
      backgroundColor = '#ffecb3';
    }
    let obj = { ...tag };
    obj.is_private = is_private;
    const self = this;
    this.tagService.update(obj.id ?? 'error', obj).subscribe(
      {
        next(value: any) {
          // если получилось поменять значение (то есть тэг свободен), то присвоим этот тэг
          tag.user = self.auth.userValue?.id;
          // и обновим снова для смены владельца
          self.tagService.update(tag.id ?? 'error', tag).subscribe((v: any) => {
            tag.is_private = value.is_private;
            tag.backgroundColor = backgroundColor;
            self.cdr.detectChanges();
          });
        },
        error(err) {
          console.error(err);
          return;
        },
      }
    );

  }

}
