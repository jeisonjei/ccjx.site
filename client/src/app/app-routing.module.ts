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
import { TopicComponent } from './pages/topic/topic.component';
import { MyQuestionsComponent } from './pages/my-topics/my-topics.component';
import { protectedGuard } from 'ngx-auth';
import { EditTopicComponent } from './pages/edit-topic/edit-topic.component';
import { RandomTopicComponent } from './pages/random-topic/random-topic.component';
import { PopularAndNotComponent } from './pages/popular-and-not/popular-and-not.component';
import { NotFoundError } from 'rxjs';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MyTagsComponent } from './pages/my-tags/my-tags.component';

const routes: Routes = [
  { path: '', component: PopularAndNotComponent },
  { path: 'account/register', component: RegisterComponent },
  { path: 'account/register/confm', component: RegisterConfmComponent },
  { path: 'account/register/success/:token', component: RegisterSuccessComponent },
  { path: 'account/login', component: LoginComponent },
  { path: 'account/new-pass-request', component: NewPassRequestComponent },
  { path: 'account/new-pass/:token', component: NewPassComponent },
  { path: 'account/new-pass-email-sent', component: NewPassEmailSentComponent },
  { path: 'account/new-pass-success/:userEmail', component: NewPassSuccessComponent },
  { path: 'users/:userId/new-topic/:topicSlug', component: NewQuestionComponent, canActivate: [protectedGuard] },
  { path: 'users/:userId/edit-topic/:topicSlug', component: EditTopicComponent, canActivate: [protectedGuard] },
  { path: 'topics/:topicSlug', component: TopicComponent },
  { path: 'my-questions', component: MyQuestionsComponent, canActivate: [protectedGuard] },
  { path: 'my-tags', component: MyTagsComponent, canActivate: [protectedGuard] },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
