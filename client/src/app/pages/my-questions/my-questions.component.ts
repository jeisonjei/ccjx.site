import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Topic } from '../../consts';
import { UrlsService } from '../../services/urls.service';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopicService } from '@app/services/topic.service';
import * as moment from 'moment';
import { TagService } from '@app/services/tag.service';
import { MatChipEvent, MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '@app/services/dialog.service';
import { AuthenticationService } from '@app/services/authentication/authentication.service';
import { ValidatorService } from '@app/services/validator.service';

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss'],
})
export class MyQuestionsComponent {
  myQuestions: any;
  myTags: any;
  selectedTags: any;
  sortedData: any[] = [];
  displayedColumns: string[] = ['date', 'record'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort?: MatSort;
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eh: ErrorHandlerService,
    private urls: UrlsService,
    private topicService: TopicService,
    private tagService: TagService,
    private dialogService: DialogService,
    private auth: AuthenticationService,
    private validator: ValidatorService,
    private tops: TopicService,
    private dials: DialogService
  ) {
    this.getMyQuestions();
    this.getMyTags();
  }
  getMyQuestions() {
    const self = this;
    this.topicService.listShortMy().subscribe({
      next(value: any) {
        self.myQuestions = value;
        const tags:any[]=[];
        for (const topic of value) {
          for (const tag of topic.tags) {
            tags.push({name:tag.name,is_private:tag.is_private});
          }
        }
        const uniqueTags:any = [];
        for (let i = 0; i < tags.length; i++) {
          if (uniqueTags.map(t=>t.name).indexOf(tags[i].name)===-1) {
            uniqueTags.push(tags[i]);
          }

        }

        self.myTags = uniqueTags.sort((a,b)=>a.name.localeCompare(b.name));
        self.sort?.sort({ id: 'date', start: 'desc' } as MatSortable);
      },
    });
  }
  getMyTags() {

  }
  formatDate(dateTime: string) {
    let date = new Date(dateTime);
    return Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      //timeZone: 'Europe/Moscow',
      //timeZoneName: 'short',
    }).format(date);
  }
  sortData(sort: Sort) {
    let data: any[] = [];
    if (this.selectedTags?.length > 0) {
      const dataWithSelectedTags = this.myQuestions.filter((topic: Topic) => {
        return topic.tags.some(tag=>this.selectedTags.includes(tag.name));
      });

      if (sort.active=='is_private') {
        if (sort.direction==='asc') {
          data = dataWithSelectedTags.sort((a, b) => {
            return a.is_private - b.is_private;
          })
        }
        else if (sort.direction === 'desc') {
          data = dataWithSelectedTags.sort((a, b) => {
            return b.is_private - a.is_private;
          })
        }
        else {
          data = dataWithSelectedTags;
        }
      }
      else if (sort.active=='date') {
        if (sort.direction === 'asc') {
          data = sortByDateAscending(dataWithSelectedTags);
        } else if (sort.direction === 'desc') {
          data = sortByDateDescending(dataWithSelectedTags);
        } else {
          data = dataWithSelectedTags;
        }
      }
      this.sortedData = data.map((item: any) => {
        const obj = { ...item, date_created: this.formatDate(item.date_created) };
        return obj;
      });
    }
    else {
      if (sort.active=='is_private') {
        if (sort.direction==='asc') {
          data = this.myQuestions.sort((a, b) => {
            return a.is_private - b.is_private;
          })
        }
        else if (sort.direction === 'desc') {
          data = this.myQuestions.sort((a, b) => {
            return b.is_private - a.is_private;
          })
        }
        else {
          data = this.myQuestions;
        }
      }
      else if (sort.active=='date') {
        if (sort.direction === 'asc') {
          data = sortByDateAscending(this.myQuestions);
        } else if (sort.direction === 'desc') {
          data = sortByDateDescending(this.myQuestions);
        } else {
          data = this.myQuestions;
        }
      }
      this.sortedData = data.map((item: any) => {
        const obj = { ...item, date_created: this.formatDate(item.date_created) };
        return obj;
      });
    }
  }
  onChipSelect(event: MatChipListboxChange) {
    this.selectedTags = event.source.value;
    if (this.selectedTags.length==0) {
      this.sortedData = this.myQuestions.map((item: any) => {
        const obj = { ...item, date_created: this.formatDate(item.date_created) };
        return obj;
      });

    }
    else {
      const data = this.sortedData.filter((topic: Topic) => {
        return topic.tags.some(tag =>this.selectedTags.includes(tag.name));
      });
      this.sortedData = data;
    }
  
  }
  editTopic(record:Topic) {
    const url = `/users/${this.auth.userValue?.id}/edit-topic/${record?.id}`;
    this.router.navigateByUrl(url);
  }

  deleteRecord(record: Topic) {
    const id = record.id ?? 'error';
    this.topicService.retrieve(id).subscribe((v: any) => {
      if (v.answers.length==0 && v.comments.length==0) {
        this.dialogService.showDelConfDial('Удаление записи', 'Вы уверены, что хотите удалить запись?').subscribe((v) => {
          if (v) {
            this.topicService.delete(id).subscribe(v => {
              this.getMyQuestions();
              
            });
          }
        })
      }
      else {
        this.dialogService.showMessDial('Информация','К вашей записи уже оставлены комментарии и/или ответы, поэтому её нельзя удалить');
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
      this.tops.create(question).subscribe({
        next(value: { user: { id: any; }; id: any; }) {
          const url = `users/${value.user.id}/new-topic/${value.id}`;
          self.router.navigateByUrl(url);
        },
      });
    }
  }
}

function sortByDateAscending(array: any[]) {
  array.sort((a, b) => {
    try {
      const dateA = moment(a.date_created, moment.ISO_8601);
      const dateB = moment(b.date_created, moment.ISO_8601);
      return dateA.diff(dateB);
    } catch (error) {
      console.error(error);
    }
    return 0;
  });
  return array;
}
function sortByDateDescending(array: any[]) {
  array.sort((a, b) => {
    try {
      const dateA = moment(a.date_created, moment.ISO_8601);
      const dateB = moment(b.date_created, moment.ISO_8601);
      return dateB.diff(dateA);
    } catch (error) {
      console.error(error);
    }
    return 0;
  });
  return array;
}
function sortByTagAscending(array: any[]) {
  array.sort( (a, b) => {
    return a.tag.localeCompare(b.tag);
  })
  return array;
}
function sortByTagDescending(array: any[]) {
  array.sort( (a, b) => {
    return b.tag.localeCompare(a.tag);
  })
  return array;
}
