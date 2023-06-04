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
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { RegisterConfmComponent } from './account/register-confm/register-confm.component';
import { RegisterSuccessComponent } from './account/register-success/register-success.component';
import { RegisterVerifyEmailTokenComponent } from './account/register-verify-email-token/register-verify-email-token.component';
import { ResetPasswordComponent } from './account/new-pass/new-pass.component';
import { ResetPassEmaillSentComponent } from './account/new-pass-email-sent/new-pass-email-sent.component';
import { NewPassSetComponent } from './account/new-pass-set/new-pass-set.component';
import { ResetPassRequestComponent } from './account/new-pass-request/new-pass-request.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RegisterConfmComponent,
    RegisterSuccessComponent,
    RegisterVerifyEmailTokenComponent,
    ResetPasswordComponent,
    ResetPassEmaillSentComponent,
    NewPassSetComponent,
    ResetPassRequestComponent
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
    MatIconModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
