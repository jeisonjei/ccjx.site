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

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss'],
})
export class MyQuestionsComponent {
  myQuestions: any;
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
    private tops: TopicService
  ) {
    this.getMyQuestions();
    // this.myQuestions = [
    //   { title: '31 июля 2023 г. в 09:16:16', date_created: '2023-07-31T09:16:16Z' },
    //   { title: '31 июля 2023 г. в 08:58:12', date_created: '2023-07-31T08:58:12Z' },
    //   { title: '31 июля 2023 г. в 08:41:32', date_created: '2023-07-31T08:41:32Z' },
    //   { title: '31 июля 2023 г. в 08:40:02', date_created: '2023-07-31T08:40:02Z' },
    //   { title: '31 июля 2023 г. в 08:37:10', date_created: '2023-07-31T08:37:10Z' },
    //   { title: '30 июля 2023 г. в 22:39:56', date_created: '2023-07-30T22:39:56Z' },
    //   { title: '30 июля 2023 г. в 22:38:14', date_created: '2023-07-30T22:38:14Z' },
    //   { title: '30 июля 2023 г. в 22:32:09', date_created: '2023-07-30T22:32:09Z' },
    //   { title: '30 июля 2023 г. в 20:17:04', date_created: '2023-07-30T20:17:04Z' },
    //   { title: '28 июля 2023 г. в 07:40:28', date_created: '2023-07-28T07:40:28Z' },
    //   { title: '28 июля 2023 г. в 07:38:28', date_created: '2023-07-28T07:38:28Z' },
    //   { title: '26 июля 2023 г. в 05:10:14', date_created: '2023-07-26T05:10:14Z' },
    //   { title: '26 июля 2023 г. в 05:05:17', date_created: '2023-07-26T05:05:17Z' },
    //   { title: '26 июля 2023 г. в 05:03:09', date_created: '2023-07-26T05:03:09Z' },
    //   { title: '26 июля 2023 г. в 04:28:01', date_created: '2023-07-26T04:28:01Z' },
    //   { title: '24 сентября 2023 г. в 07:20:36', date_created: '2023-09-24T07:20:36Z' },
    //   { title: '24 июля 2023 г. в 10:01:09', date_created: '2023-07-24T10:01:09Z' },
    //   { title: '24 июля 2023 г. в 09:37:44', date_created: '2023-07-24T09:37:44Z' },
    //   { title: '24 июля 2023 г. в 09:24:04', date_created: '2023-07-24T09:24:04Z' },
    //   { title: '24 июля 2023 г. в 08:09:04', date_created: '2023-07-24T08:09:04Z' },
    //   { title: '24 июля 2023 г. в 07:51:25', date_created: '2023-07-24T07:51:25Z' },
    //   { title: '24 июля 2023 г. в 07:47:47', date_created: '2023-07-24T07:47:47Z' },
    //   { title: '22 июля 2023 г. в 07:56:06', date_created: '2023-07-22T07:56:06Z' },
    //   { title: '22 июля 2023 г. в 07:45:15', date_created: '2023-07-22T07:45:15Z' },
    //   { title: '22 июля 2023 г. в 06:51:54', date_created: '2023-07-22T06:51:54Z' },
    //   { title: '21 июля 2023 г. в 23:10:12', date_created: '2023-07-21T23:10:12Z' },
    //   { title: '21 июля 2023 г. в 12:25:30', date_created: '2023-07-21T12:25:30Z' },
    //   { title: '21 июля 2023 г. в 12:20:51', date_created: '2023-07-21T12:20:51Z' },
    //   { title: '21 июля 2023 г. в 11:56:47', date_created: '2023-07-21T11:56:47Z' },
    //   { title: '19 июля 2023 г. в 07:36:55', date_created: '2023-07-19T07:36:55Z' },
    //   { title: '19 июля 2023 г. в 07:31:16', date_created: '2023-07-19T07:31:16Z' },
    //   { title: '19 июля 2023 г. в 07:17:15', date_created: '2023-07-19T07:17:15Z' },
    //   { title: '15 августа 2023 г. в 09:26:32', date_created: '2023-08-15T09:26:32Z' },
    //   { title: '15 августа 2023 г. в 07:10:26', date_created: '2023-08-15T07:10:26Z' },
    //   { title: '14 сентября 2023 г. в 08:53:44', date_created: '2023-09-14T08:53:44Z' },
    //   { title: '11 августа 2023 г. в 10:44:48', date_created: '2023-08-11T10:44:48Z' },
    //   { title: '11 августа 2023 г. в 10:19:55', date_created: '2023-08-11T10:19:55Z' },
    //   { title: '10 августа 2023 г. в 16:48:00', date_created: '2023-08-10T16:48:00Z' },
    //   { title: '10 августа 2023 г. в 08:40:36', date_created: '2023-08-10T08:40:36Z' },
    //   { title: '09 августа 2023 г. в 09:05:04', date_created: '2023-08-09T09:05:04Z' },
    //   { title: '08 сентября 2023 г. в 12:56:59', date_created: '2023-09-08T12:56:59Z' },
    //   { title: '08 августа 2023 г. в 09:13:12', date_created: '2023-08-08T09:13:12Z' },
    //   { title: '06 октября 2023 г. в 12:50:17', date_created: '2023-10-06T12:50:17Z' },
    //   { title: '05 октября 2023 г. в 11:04:44', date_created: '2023-10-05T11:04:44Z' },
    //   { title: '04 августа 2023 г. в 06:43:35', date_created: '2023-08-04T06:43:35Z' },
    //   { title: '02 августа 2023 г. в 08:07:27', date_created: '2023-08-02T08:07:27Z' },
    //   { title: '02 августа 2023 г. в 08:03:03', date_created: '2023-08-02T08:03:03Z' },
    //   { title: '02 августа 2023 г. в 07:54:37', date_created: '2023-08-02T07:54:37Z' },
    //   { title: '01 августа 2023 г. в 17:21:14', date_created: '2023-08-01T17:21:14Z' },
    //   { title: '01 августа 2023 г. в 17:19:57', date_created: '2023-08-01T17:19:57Z' },
    //   { title: '01 августа 2023 г. в 07:11:10', date_created: '2023-08-01T07:11:10Z' },
    //   { title: '01 августа 2023 г. в 06:47:28', date_created: '2023-08-01T06:47:28Z' }
    // ];
    // this.dataSource = new MatTableDataSource(this.myQuestions.slice());
    // this.dataSource.sort = this.sort ?? null;
    // this.sort?.sort({id: 'date', start: 'desc'} as MatSortable);
  }
  getMyQuestions() {
    const self = this;
    this.tops.listShortMy().subscribe({
      next(value: any) {
        self.myQuestions = value;
        self.sort?.sort({ id: 'date', start: 'desc' } as MatSortable);
      },
    });
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
    if (sort.active=='date') {
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
