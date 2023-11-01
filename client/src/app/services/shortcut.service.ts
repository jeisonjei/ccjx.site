import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsService {
  subject: Subject<boolean> = new Subject;
  constructor() { }
  focusEvent() {
    this.subject.next(true);
  }
  blurEvent() {
    this.subject.next(false);
  }

}
