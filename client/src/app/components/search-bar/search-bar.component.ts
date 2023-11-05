import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { Topic } from '../../consts';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { TopicService } from '../../services/topic.service';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ShortcutsService } from '@app/services/shortcut.service';
import { BreakpointObserver } from '@angular/cdk/layout';

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
