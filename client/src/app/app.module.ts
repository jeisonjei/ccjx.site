import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatToolbarModule } from "@angular/material/toolbar";
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { RegisterConfmComponent } from './account/register-confm/register-confm.component';
import { RegisterSuccessComponent } from './account/register-success/register-success.component';
import { NewPassComponent } from './account/new-pass/new-pass.component';
import { NewPassEmailSentComponent } from './account/new-pass-email-sent/new-pass-email-sent.component';
import { NewPassSuccessComponent } from './account/new-pass-success/new-pass-success.component';
import { NewPassRequestComponent } from './account/new-pass-request/new-pass-request.component';
import { WaitingButtonComponent } from './shared/components/waiting-button/waiting-button.component';
import { LoggedInHeaderComponent } from './components/logged-in-header/logged-in-header.component';
import { LoginDisplayComponent } from './components/login-display/login-display.component';
import { LoggedOutHeaderComponent } from './components/logged-out-header/logged-out-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NewQuestionComponent } from './pages/new-topic/new-topic.component';
import { AuthenticationModule } from './services/authentication/authentication.module';
import { TopicComponent } from './pages/topic/topic.components';
import { MyQuestionsComponent } from './pages/my-questions/my-questions.component';
import { AnswerComponent } from './components/answer/answer.component';
import { QuestionComponent } from "./components/question/question.component";
import { NewAnswerComponent } from './components/new-answer/new-answer.component';
import { NewCommentComponent } from './components/new-comment/new-comment.component';
import { CommentComponent } from './components/comment/comment.component';
import { TopTopicsComponent } from './pages/top-topics/top-topics.component';
import { NewsComponent } from './pages/news/news.component';
import { PleaseRegisterComponent } from './shared/dialogs/please-register/please-register.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { QuillModule } from "ngx-quill";
import { RefreshTokenErrorInterceptor } from '_helpers/refresh.token.error.interceptor';
import { EditTopicComponent } from './pages/edit-topic/edit-topic.component';
import { EditAnswerComponent } from './components/edit-answer/edit-answer.component';
import { CommonEditorRichComponent } from './shared/components/common-editor-rich/common-editor-rich.component';
import { CommonEditorSimpleComponent } from './shared/components/common-editor-simple/common-editor-simple.component';
import { DelConfComponent } from './shared/dialogs/del-conf/del-conf.component';
import { EditCommentComponent } from './components/edit-comment/edit-comment.component';
import { MatCardModule } from "@angular/material/card";
import { RandomTopicComponent } from './pages/random-topic/random-topic.component';
import { MatProgressBar, MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { LoginDisplaySmallComponent } from './components/login-display-small/login-display-small.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatBadgeModule } from "@angular/material/badge";
import { MatChipsModule } from "@angular/material/chips";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { PopularAndNotComponent } from './pages/popular-and-not/popular-and-not.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RegisterConfmComponent,
    RegisterSuccessComponent,
    RegisterSuccessComponent,
    NewPassComponent,
    NewPassEmailSentComponent,
    NewPassSuccessComponent,
    NewPassRequestComponent,
    WaitingButtonComponent,
    LoggedInHeaderComponent,
    LoginDisplayComponent,
    LoggedOutHeaderComponent,
    SearchBarComponent,
    NewQuestionComponent,
    TopicComponent,
    MyQuestionsComponent,
    QuestionComponent,
    AnswerComponent,
    NewAnswerComponent,
    NewCommentComponent,
    CommentComponent,
    TopTopicsComponent,
    NewsComponent,
    PleaseRegisterComponent,
    EditTopicComponent,
    EditAnswerComponent,
    CommonEditorRichComponent,
    CommonEditorSimpleComponent,
    DelConfComponent,
    EditCommentComponent,
    RandomTopicComponent,
    LoginDisplaySmallComponent,
    PopularAndNotComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthenticationModule,
    MatGridListModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    QuillModule.forRoot(),
    MatCardModule,
    MatProgressBarModule,
    MatCheckboxModule,
    FontAwesomeModule,
    MatBadgeModule,
    MatChipsModule,
    MatSortModule,
    MatTableModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
