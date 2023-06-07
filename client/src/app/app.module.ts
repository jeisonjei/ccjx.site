import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatToolbarModule } from "@angular/material/toolbar";
import {FormsModule,FormControl} from '@angular/forms'
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
    LoggedOutHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatToolbarModule,
    FormsModule,
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
