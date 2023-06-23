import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Router } from '@angular/router';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Question } from '../../consts';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from '../../services/urls.service';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, filter, from, map, of, startWith } from 'rxjs';
import { QuestionService } from '../../services/question.service';
import { ValidatorService } from '../../services/validator.service';

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
    private urls: UrlsService,
    private questionService: QuestionService,
    private validator:ValidatorService
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
  onQuestion(value: string) {
    if (!this.validator.text(value)) {
      return;
    }
    const userId = this.auth.cu?.id;
    if (userId == undefined) {
      console.error('Не указан userId');
      return;
    }
    const question: Question = {
      user: {id:userId},
      topic: value
    };
    const self = this;
    this.questionService.create(question).subscribe({
      next(value: { user: { id: any; }; id: any; }) {
        const url = `user/${value.user.id}/new-question/${value.id}`;
        self.router.navigateByUrl(url);
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

