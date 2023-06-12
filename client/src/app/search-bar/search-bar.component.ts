import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ErrorHandlerService } from '../services/errors/error-handler.service';
import { Router } from '@angular/router';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Question } from '../consts';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from '../urls.service';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, filter, from, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  allQuestions: Question[] = [];
  filteredQuestions?: Observable<Question[]>;
  @Output()
  question: EventEmitter<string> = new EventEmitter();
  @ViewChild(MatAutocompleteTrigger)
  trigger?: MatAutocompleteTrigger;
  q: FormControl<any> = new FormControl('');
  constructor(
    private eh: ErrorHandlerService,
    private router: Router,
    private auth: AuthenticationService,
    private http: HttpClient,
    private urls: UrlsService
  ) {}
  ngOnInit(): void {
    this.getAllQuestions();
    this.filteredQuestions = this.q.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  clearSelection(event:MatAutocompleteSelectedEvent) {
    event.option.deselect();
  }
  private _filter(value: string): Question[] {
    const filterValue = value.toLowerCase();
    return this.allQuestions.filter((q) =>
      q.topic.toLowerCase().includes(filterValue)
    );
  }
  onChange(event: Event) {
    const e = event.target as HTMLInputElement;
    let val = e.value;
    // this.onQuestion(val);
    this.question.emit(val);
    this.trigger?.closePanel();
    this.trigger?.writeValue('');
  }
  onQuestion(i: any) {
    const t = i.value;
    const userId = this.auth.cu?.id;
    if (userId == undefined) {
      console.error('Не указан userId');
      return;
    }
    const url = this.urls.getNewQuestionListUrl(userId);
    const question: Question = {
      user: userId,
      topic: t
    };
    const self = this;
    this.http.post(url, question).subscribe({
      next(value: any) {
        const questionId = value.id;
        const userId = value.user;
        const url = `user/${userId}/new-question/${questionId}`;
        self.router.navigateByUrl(url);
      },
      complete() {},
      error(err) {
        self.eh.handleError(err.error);
      },
    });
  }
  getAllQuestions() {
    const self = this;
    this.http.get(this.urls.URL_ALL_QUESTIONS).subscribe({
      next(value: any) {
        self.allQuestions = [...value];
      },
    });
  }
  navigate(id?: string) {
    this.router.navigateByUrl(`question/${id}`);
    this.trigger?.writeValue('');
  }
}
