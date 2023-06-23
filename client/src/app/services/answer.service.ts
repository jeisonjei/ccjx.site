import { Injectable } from '@angular/core';
import { UrlsService } from './urls.service';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../consts';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private urls:UrlsService,private http:HttpClient) { }
  list(questionId:string) {
    const url = this.urls.getAnswersUrl(questionId);
    return this.http.get(url);
  }
  create(answer:Answer) {
    const url = this.urls.URL_ANSWERS_CREATE;
    return this.http.post(url,answer);
  }
}
