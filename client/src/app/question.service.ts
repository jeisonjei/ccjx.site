import { Injectable } from '@angular/core';
import { Question } from './consts';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { ErrorHandlerService } from './services/errors/error-handler.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http:HttpClient,private urls:UrlsService,private eh:ErrorHandlerService) { }
  add(question: Question):Observable<any>{
    const url=this.urls.getNewQuestionCreateUrl(question.user.id);
    return this.http.post(url, question);
  }
}
