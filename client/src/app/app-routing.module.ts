import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPassComponent } from './account/new-pass/new-pass.component';
import { RegisterComponent } from './account/register/register.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterConfmComponent } from './account/register-confm/register-confm.component';
import { RegisterSuccessComponent } from './account/register-success/register-success.component';
import { NewPassEmailSentComponent } from './account/new-pass-email-sent/new-pass-email-sent.component';
import { NewPassSuccessComponent } from './account/new-pass-success/new-pass-success.component';
import { NewPassRequestComponent } from './account/new-pass-request/new-pass-request.component';
import { NewQuestionComponent } from './pages/new-question/new-question.component';
import { TopicComponent } from './pages/topic/topic.components';
import { MyQuestionsComponent } from './pages/my-questions/my-questions.component';
import { ProtectedGuard } from 'ngx-auth';

const routes: Routes = [
  { path: 'account/register', component: RegisterComponent },
  { path: 'account/register/confm', component: RegisterConfmComponent },
  { path: 'account/register/success/:token', component: RegisterSuccessComponent },
  { path: 'account/login', component: LoginComponent },
  {path:'account/new-pass-request',component:NewPassRequestComponent},
  { path: 'account/new-pass/:token', component: NewPassComponent },
  { path: 'account/new-pass-email-sent', component: NewPassEmailSentComponent },
  { path: 'account/new-pass-success/:userEmail', component: NewPassSuccessComponent },
  { path: 'user/:userId/new-question/:questionId', component: NewQuestionComponent },
  {path:'question/:questionId',component:TopicComponent,canActivate:[ProtectedGuard]},
  {path:'my-questions',component:MyQuestionsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
