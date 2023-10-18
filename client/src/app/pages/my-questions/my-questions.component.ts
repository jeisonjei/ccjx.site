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
    //   { title: 'Question 1', date_created: '2022-01-01T10:30:00Z' },
    //   { title: 'Question 2', date_created: '2022-02-05T15:45:00Z' },
    //   { title: 'Question 3', date_created: '2022-03-10T08:20:00Z' },
    //   { title: 'Question 4', date_created: '2022-04-15T13:10:00Z' },
    //   { title: 'Question 5', date_created: '2022-05-20T18:00:00Z' },
    //   { title: 'Question 6', date_created: '2022-06-25T09:50:00Z' },
    //   { title: 'Question 7', date_created: '2022-07-03T14:25:00Z' },
    //   { title: 'Question 8', date_created: '2022-08-08T20:15:00Z' },
    //   { title: 'Question 9', date_created: '2022-09-13T11:40:00Z' },
    //   { title: 'Question 10', date_created: '2022-10-18T16:55:00Z' },
    //   { title: 'Question 11', date_created: '2022-11-23T07:05:00Z' },
    //   { title: 'Question 12', date_created: '2022-12-28T12:30:00Z' },
    //   { title: 'Question 13', date_created: '2023-01-02T17:40:00Z' },
    //   { title: 'Question 14', date_created: '2023-02-07T09:15:00Z' },
    //   { title: 'Question 15', date_created: '2023-03-12T14:25:00Z' },
    //   { title: 'Question 16', date_created: '2023-04-17T19:50:00Z' },
    //   { title: 'Question 17', date_created: '2023-05-22T11:10:00Z' },
    //   { title: 'Question 18', date_created: '2023-06-27T16:30:00Z' },
    //   { title: 'Question 19', date_created: '2023-07-04T07:45:00Z' },
    //   { title: 'Question 20', date_created: '2023-08-09T13:55:00Z' },
    //   { title: 'Question 21', date_created: '2023-09-14T18:20:00Z' },
    //   { title: 'Question 22', date_created: '2023-10-19T09:30:00Z' },
    //   { title: 'Question 23', date_created: '2023-11-24T14:45:00Z' },
    //   { title: 'Question 24', date_created: '2023-12-29T20:00:00Z' },
    //   { title: 'Question 25', date_created: '2024-01-03T11:20:00Z' },
    //   { title: 'Question 26', date_created: '2024-02-08T16:35:00Z' },
    //   { title: 'Question 27', date_created: '2024-03-13T07:45:00Z' },
    //   { title: 'Question 28', date_created: '2024-04-18T13:00:00Z' },
    //   { title: 'Question 29', date_created: '2024-05-23T18:20:00Z' },
    //   { title: 'Question 30', date_created: '2024-06-28T09:30:00Z' },
    //   { title: 'Question 31', date_created: '2024-07-05T14:45:00Z' },
    //   { title: 'Question 32', date_created: '2024-08-10T20:00:00Z' },
    //   { title: 'Question 33', date_created: '2024-09-15T11:20:00Z' },
    //   { title: 'Question 34', date_created: '2024-10-20T16:35:00Z' },
    //   { title: 'Question 35', date_created: '2024-11-25T07:45:00Z' },
    //   { title: 'Question 36', date_created: '2024-12-30T13:00:00Z' },
    //   { title: 'Question 37', date_created: '2025-01-04T18:20:00Z' },
    //   { title: 'Question 38', date_created: '2025-02-09T09:30:00Z' },
    //   { title: 'Question 39', date_created: '2025-03-14T14:45:00Z' },
    //   { title: 'Question 40', date_created: '2025-04-19T20:00:00Z' },
    //   { title: 'Question 41', date_created: '2025-05-24T11:20:00Z' },
    //   { title: 'Question 42', date_created: '2025-06-29T16:35:00Z' },
    //   { title: 'Question 43', date_created: '2025-07-06T07:45:00Z' },
    //   { title: 'Question 44', date_created: '2025-08-11T13:00:00Z' },
    //   { title: 'Question 47', date_created: '2025-11-26T14:45:00Z' },
    //   { title: 'Question 45', date_created: '2025-09-16T18:20:00Z' },
    //   { title: 'Question 50', date_created: '2026-02-10T16:35:00Z' },
    //   { title: 'Question 46', date_created: '2025-10-21T09:30:00Z' },
    //   { title: 'Question 48', date_created: '2025-12-31T20:00:00Z' },
    //   { title: 'Question 49', date_created: '2026-01-05T11:20:00Z' },
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
    if (sort.direction === 'asc') {
      data = sortByDateAscending(this.myQuestions);
    } else if (sort.direction === 'desc') {
      data = sortByDateDescending(this.myQuestions);
    } else {
      data = this.myQuestions;
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
