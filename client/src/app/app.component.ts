import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Topic } from "./consts";
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService, LoginInfo } from './services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './services/error-handler.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ShortcutsService as ShortcutService } from './services/shortcut.service';
import { LoadingService } from './services/loading.service';

const SEARCH_SHORTCUT = 'ControlRight.ShiftRight.KeyQ';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  pubm?: string;
  userValue?: LoginInfo | null;

  loading: boolean = false;

  // ****************************************************************
  constructor(private http: HttpClient, public auth: AuthenticationService, private router: Router, private eh: ErrorHandlerService, private shortcutService: ShortcutService, private loadingService: LoadingService, private changeDetector: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.auth.loggedIn.subscribe(v => {
      this.userValue = v;
    });
    this.loadingService.loading$.subscribe((v: boolean) => {
      this.loading = v;
      this.changeDetector.detectChanges();
    })
  }
  @HostListener('window:keydown.control.k', ['$event'])
  handleSearchKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    this.shortcutService.focusEvent();
  }
  @HostListener('window:keydown.esc', ['$event'])
  handleEscKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    this.shortcutService.blurEvent();
  }

}
