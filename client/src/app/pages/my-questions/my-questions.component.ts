import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Topic } from '../../consts';
import { UrlsService } from '../../services/urls.service';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopicService } from '@app/services/question.service';

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
    this.tops.listShort().subscribe({
      next(value: any) {
        console.log(`🔥 v: ${JSON.stringify(value)}`);
        self.myQuestions = value;
        for (const item of self.myQuestions) {
          let dateTime = self.formatDate(item.date_created??'error');
          item.date_created = dateTime;
        }
        self.dataSource=new MatTableDataSource(self.myQuestions.slice());
        self.sort?.sort(({ id: 'date', start: 'desc'}) as MatSortable);
        self.dataSource.sort = self.sort??null;
    
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
        // timeZone: 'Europe/Moscow',
        // timeZoneName: 'short',
      }).format(date);
  }
  sortData(sort: Sort) {
    const data = this.myQuestions.slice();
    if (!sort.active || sort.direction==='asc') {
      this.dataSource = data;
      return;
    }
    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date':
          return compare(a.date_created??'error',b.date_created??'error',isAsc);
        case 'record':
          return compare(a.title??'error',b.title??'error',isAsc);
        default:
          return 0;
      }
    })
  }
  
}
function compare(a: string, b: string, isAsc: boolean) {
  return (a<b?-1:1)*(isAsc?1:-1);
}
