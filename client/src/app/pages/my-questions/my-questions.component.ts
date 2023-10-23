import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Topic } from '../../consts';
import { UrlsService } from '../../services/urls.service';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopicService } from '@app/services/question.service';
import * as moment from 'moment';
import { TagService } from '@app/services/tag.service';

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss'],
})
export class MyQuestionsComponent {
  myQuestions: any;
  myTags: any;
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
    private tops: TopicService,
    private tagService: TagService
  ) {
    this.getMyQuestions();
    this.getMyTags();
  }
  getMyQuestions() {
    const self = this;
    this.tops.listShortMy().subscribe({
      next(value: any) {
        self.myQuestions = value;
        const tags:any[]=[];
        for (const topic of value) {
          for (const tag of topic.tags) {
            tags.push(tag.name);
          }
        }
        self.myTags = tags;
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
  onChipSelect(event: any) {

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
