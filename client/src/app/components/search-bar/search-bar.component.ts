import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
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
import { MessDial, Topic } from '../../consts';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from '../../services/urls.service';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, filter, from, map, of, startWith, timestamp } from 'rxjs';
import { TopicService } from '../../services/topic.service';
import { ValidatorService } from '../../services/validator.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PleaseRegisterComponent } from 'src/app/shared/dialogs/please-register/please-register.component';
import { DialogConfig } from '@angular/cdk/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { isUndefined } from 'util';
import { ShortcutsService } from '@app/services/shortcut.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

const customBreakpoints = {
  small: '(max-width:599px)',
  large: '(min-width:600px)'
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  allQuestions: Topic[] = [];
  filteredQuestions?: Observable<Topic[]>;
  faMagnifyingGlass = faMagnifyingGlass;
  @Output()
  question: EventEmitter<string> = new EventEmitter();
  @ViewChild(MatAutocompleteTrigger)
  trigger?: MatAutocompleteTrigger;
  @ViewChild('i') searchInput?:ElementRef;
  q: FormControl<any> = new FormControl('');
  screenSize$?: Observable<boolean>;
  constructor(
    private router: Router,
    private topicService: TopicService,
    private shortcutService: ShortcutsService,
    private renderer: Renderer2,
  private breakpointObserver:BreakpointObserver) { }
  ngOnInit(): void {
    this.screenSize$ = this.breakpointObserver.observe(customBreakpoints.small).pipe(
      map(result => result.matches)
    );
    this.shortcutService.subject.subscribe((v) => {
      if (v) {
        this.renderer.selectRootElement(this.searchInput?.nativeElement).focus();
      }
      else {
        this.renderer.selectRootElement(this.searchInput?.nativeElement).blur();
      }
    })
    this.filteredQuestions = this.q.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        if (value === undefined) {
          return this._filter(value || '', this.allQuestions);
        }
        const matchTagNotCompleted = value.match(/^\([^\)]*$/);
        const matchTagComplete = value.match(/^\(.*\).*$/);
        if (matchTagNotCompleted != null) {
          const tag = matchTagNotCompleted[0].replace('(', '');
          return this._filterByTag(tag, this.allQuestions);
        } else if (matchTagComplete != null) {
          const v = value.replace(/\(.*\)( |)+/, '');
          const m = value.match(/^\(.*\)/);
          let tag;
          if (m != null) {
            tag = m[0].replace('(', '').replace(')', '');
            const topics = this._filterByTag(tag, this.allQuestions);
            const filtered = this._filter(v, topics);
            return filtered;
          }
          return this._filter(value || '', this.allQuestions);
        } else {
          return this._filter(value || '', this.allQuestions);
        }
      })
    );
  }
  clearSelection(event: MatAutocompleteSelectedEvent) {
    event.option.deselect();
  }
  private _filter(value: string, collection: any): Topic[] {
    const filterValue = value.toLowerCase();
    return collection.filter((q) =>
      q.title.toLowerCase().includes(filterValue)
    );
  }
  private _filterByTag(value: string, collection: any): Topic[] {
    const filterValue = value.toLowerCase();
    const questions = collection.filter((v) => {
      const tagNames = v.tags.map((v) => v.name);
      return tagNames.some((v) => v.includes(filterValue));
    });
    return questions;
  }

  getAllQuestions() {
    this.topicService.listShort().subscribe((v: any) => {
      this.allQuestions = [...v];
    });
  }
  navigate(id?: string) {
    this.router.navigateByUrl(`topics/${id}`);
    this.trigger?.writeValue('');
  }
}
