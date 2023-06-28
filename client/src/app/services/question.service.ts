import { Injectable } from '@angular/core';
import { Question } from '../consts';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http:HttpClient,private urls:UrlsService,private eh:ErrorHandlerService) { }
  create(question: Question):Observable<any>{
    const url=this.urls.getNewQuestionCreateUrl(question.user.id);
    return this.http.post(url, question);
  }
  delete(id: string) {
    const url = this.urls.getQuestionDeleteUrl(id);
    return this.http.delete(url);
  }
}
