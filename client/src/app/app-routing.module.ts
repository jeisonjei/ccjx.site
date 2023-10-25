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
import { NewQuestionComponent } from './pages/new-topic/new-topic.component';
import { TopicComponent } from './pages/topic/topic.components';
import { MyQuestionsComponent } from './pages/my-questions/my-questions.component';
import { protectedGuard } from 'ngx-auth';
import { EditTopicComponent } from './pages/edit-topic/edit-topic.component';
import { RandomTopicComponent } from './pages/random-topic/random-topic.component';
import { PopularAndNotComponent } from './pages/popular-and-not/popular-and-not.component';

const routes: Routes = [
  { path: 'account/register', component: RegisterComponent },
  { path: 'account/register/confm', component: RegisterConfmComponent },
  { path: 'account/register/success/:token', component: RegisterSuccessComponent },
  { path: 'account/login', component: LoginComponent },
  { path:'account/new-pass-request',component:NewPassRequestComponent},
  { path: 'account/new-pass/:token', component: NewPassComponent },
  { path: 'account/new-pass-email-sent', component: NewPassEmailSentComponent },
  { path: 'account/new-pass-success/:userEmail', component: NewPassSuccessComponent },
  { path: 'users/:userId/new-topic/:topicId', component: NewQuestionComponent, canActivate: [protectedGuard] },
  { path: 'users/:userId/edit-topic/:topicId', component: EditTopicComponent, canActivate: [protectedGuard]},
  { path:'topics/:topicId',component:TopicComponent},
  { path: 'my-questions', component: MyQuestionsComponent,canActivate:[protectedGuard] },
  {path:'',component:PopularAndNotComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
