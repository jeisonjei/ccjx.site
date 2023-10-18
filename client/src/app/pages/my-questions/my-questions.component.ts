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
export class MyQuestionsComponent{
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
  }
  getMyQuestions() {
    const self = this;
    this.tops.listShortMy().subscribe({
      next(value: any) {
        self.myQuestions = value;
        self.dataSource=new MatTableDataSource(self.myQuestions.slice());
        self.dataSource.sort = self.sort??null;
        self.sort?.sort(({ id: 'date', start: 'desc'}) as MatSortable);
    
      },
    });
  }
  formatDate(dateTime:string) {
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
    let data:any[]=[];
    if (sort.direction==='asc') {
      data=sortByDateAscending(this.myQuestions);
    }
    else if (sort.direction==='desc') {
      data=sortByDateDescending(this.myQuestions);
    }
    else {
      data = this.myQuestions;
    }
    this.sortedData = data.map((item: any) => {
      const obj = {...item, date_created: this.formatDate(item.date_created)};
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
      const dateA = moment(a.date_created,moment.ISO_8601);
      const dateB = moment(b.date_created, moment.ISO_8601);     
      return dateB.diff(dateA);
    } catch (error) {
      console.error(error);
    }
    return 0;

  });
  return array;

}
