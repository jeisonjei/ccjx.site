import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { DialogService } from '@app/services/dialog.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.scss'],
})
export class NewQuestionComponent implements OnInit {
  faTag = faTag;
  title: string = '';
  topicId: string = '';
  topicSlug: string='';
  userId: string = '';
  isArticle: boolean = true;
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
    private topicService: TopicService,
    private tagService: TagService,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef,
  private dialogService: DialogService) {

  }
  @ViewChild(MatAutocompleteTrigger)
  autocomplete?: MatAutocompleteTrigger;
  @ViewChild('autocompleteInput')
  autoInput?: ElementRef;
  @HostListener('window:beforeunload',['$event'])
  onBeforeUnload(event: Event) {
    event.preventDefault();
    event.returnValue = false;
  }
  @HostListener('window:unload',['$event'])
  onUnload(event: Event) {
    fetch(this.urls.getQuestionDeleteUrl(this.topicSlug), { method: 'DELETE', keepalive: true }).then().catch(error => {
      console.error(error);
    })
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    // Perform your delete operation here when the user goes back to the previous URL
    fetch(this.urls.getQuestionDeleteUrl(this.topicSlug), { method: 'DELETE', keepalive: true }).then().catch(error => {
      console.error(error);
    });
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
    const topicSlug = this.activatedRoute.snapshot.paramMap.get('topicSlug');
    this.userId = userId??'';
    this.topicSlug = topicSlug??'';
    const url = this.urls.getUrlTopicDetail(topicSlug??'Error');
    const self = this;
    this.http.get(url).subscribe({
      next(value: any) {
        self.title = value.title != undefined ? value.title : 'Новая запись';
        self.tagsAdded = value.tags;
        self.topicId = value.id;
      },
    });
  }
  addQuestion(content: string) {
    const title = this.title;
    const text = content;
    const topicSlug = this.activatedRoute.snapshot.paramMap.get('topicSlug');
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    const t: Topic = {
      user: userId??'Error',
      title: title,
      text: text,
      is_article: this.isArticle,
      is_private:this.isPrivate
    };
    this.topicService.update(topicSlug ?? 'error', t).subscribe((v: any) => {
      const url = `topics/${v.slug}`;
      this.router.navigateByUrl(url);      
    });
  }
  cancel() {
    this.topicService.delete(this.topicSlug??'').subscribe();
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
        is_private:false, // по умолчанию все новые тэги создаются как публичные
        user: this.auth.userValue?.id,
        topics: [this.topicId]
      }
      const self = this;
      this.tagService.create(tag).subscribe({
        next(value) {
          self.tagsAdded.push(value);
        },
        error(err) {
          /**
           * Эта ошибка никогда не возникнет, так как на серверной стороне, в модели убрана проверка
           * на уникальность имён тэгов. Уникальность имени проверяется только для публичных тэгов в модуле view.py 
           * при создании, но если такой тэг уже есть среди this.tags, то выполняется блок 'else', то есть попытки
           * создания нового тэга не происходит, а берётся уже существующий.
           */
          if (err.error.public_message.includes('уже существует')) {
            self.autocomplete?.closePanel();
            self.autoInput?.nativeElement.blur();
            const random = Math.floor(Math.random() * 1000) + 1;
            self.dialogService.showMessDial("Информация", `Извините, тэг "${tag.name}" уже существует среди публичных тэгов. Если вы хотели использовать тэг с таким именем, то используйте публичный тэг. Также вы можете использовать никем незанятые публичные тэги в качестве личных. Для того, чтобы сделать тэг личным нажмите на него`);
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
          self.dialogService.showMessDial("Информация",err.error.public_message);
          console.error(err.error.public_message);
          return;
        },
      }
    );

  }

}
