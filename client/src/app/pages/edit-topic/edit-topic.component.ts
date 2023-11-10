import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '@app/services/topic.service';
import { UrlsService } from '@app/services/urls.service';
import { Tag, Topic } from "@app/consts";
import { TagService } from '@app/services/tag.service';
import { Observable, map, startWith } from 'rxjs';
import { faTag  } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from 'ngx-auth';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DialogService } from '@app/services/dialog.service';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss'],
})

export class EditTopicComponent implements OnInit, AfterViewInit {
onNotifyMeChange(checked: boolean) {
  this.notifyMe = checked;
}
  faTag = faTag;
  title = '';
  userId = '';
  topicId = '';
  topicSlug = '';
  content = '123';
  isArticle: boolean=false;
  isPrivate: boolean=false;
  myControl: FormControl=new FormControl('');
  tags: any[]=[];
  tagsFiltered?: Observable<any[]>;
  tagsAdded: any[]=[];
  tagSelected: any = null;
  markdownSelected='';
notifyMe: boolean=false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private topicService: TopicService,
    private router: Router,
    private urls: UrlsService,
    private tagService: TagService,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }
  @ViewChild(MatAutocompleteTrigger)
  autocomplete?: MatAutocompleteTrigger;
  @ViewChild('autocompleteInput')
  autoInput?: ElementRef;

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
    this.topicSlug =
      this.activatedRoute.snapshot.paramMap.get('topicSlug') ?? 'error';
    this.topicService.retrieve(this.topicSlug).subscribe((v: any) => {
      this.title = v.title;
      this.content = v.text;
      this.isArticle = v.is_article;
      this.isPrivate = v.is_private;
      this.tagsAdded = v.tags;
      this.topicId = v.id;
      this.notifyMe = v.notify_me;
    });
  }
  edit(content: string) {
    const topic: Topic = {
      id: this.topicSlug,
      user: this.userId,
      title: this.title,
      text: content,
      is_article: this.isArticle,
      is_private: this.isPrivate,
      notify_me:this.notifyMe
    }
    this.topicService.update(this.topicSlug,topic).subscribe((v:any) => {
      const url = `/topics/${v.slug}`;
      this.router.navigateByUrl(url);
    });
  }
  cancel() {
    const url = `/topics/${this.topicSlug}`;
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
    this.tagService.listMy().subscribe((v:any) => {
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
      const self = this;
      this.tagService.create(tag).subscribe({
        next(value) {
          self.tagsAdded.push(value);
        },
        error(err) {
          if (err.error.name[0].includes('уже существует')) {
            self.autocomplete?.closePanel();
            self.autoInput?.nativeElement.blur();
            const random = Math.floor(Math.random() * 1000) + 1;
            self.dialogService.showMessDial("Информация", `Извините, тэг "${tag.name}" уже кем-то занят. Попробуйте использовать другой тэг, например "${tag.name}-${random}"`);
            }
        },
      });
    }
    else {
      // получить id существующего тэга
      let tag = this.tags.filter(v => v.name === tagName)[0];
      tag.topics.push(Number.parseInt(this.topicSlug));
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
    let is_private = false;
    if (tag.is_private) {
      is_private = false;
    }
    else {
      is_private = true;
    }
    let obj = { ...tag };
    obj.is_private = is_private;
    const self = this;
    this.tagService.update(obj.id ?? 'error', obj).subscribe(
      {
        next(value: any) {
          // если получилось поменять значение (то есть тэг свободен), то присвоим этот тэг
          obj.user = self.auth.userValue?.id;
          // и обновим снова для смены владельца
          self.tagService.update(obj.id ?? 'error', obj).subscribe((v: any) => {
            tag.is_private = value.is_private;
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
