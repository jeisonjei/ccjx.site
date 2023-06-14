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
import { LoggedInHeaderComponent } from './logged-in-header/logged-in-header.component';
import { LoginDisplayComponent } from './login-display/login-display.component';
import { LoggedOutHeaderComponent } from './logged-out-header/logged-out-header.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NewQuestionComponent } from './new-question/new-question.component';
import { AuthenticationModule } from './services/authentication/authentication.module';
import { QuestionPageComponent } from './question-page/question-page.component';
import { MyQuestionsComponent } from './my-questions/my-questions.component';
import { AnswerComponent } from './answer/answer.component';
import { QuestionComponent } from "./question/question.component";

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
    QuestionPageComponent,
    MyQuestionsComponent,
    QuestionComponent,
    AnswerComponent,
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
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
