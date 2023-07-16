import { Injectable } from '@angular/core';
import { UrlsService } from './urls.service';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../consts';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private urls:UrlsService,private http:HttpClient) { }
  create(answer:Answer) {
    const url = this.urls.URL_ANSWERS_CREATE;
    return this.http.post(url,answer);
  }
  retrieve(id: string) {
    
  }
  update(answer?: Answer) {
    const url = this.urls.getUrlAnswerDetail(answer?.id ?? 'error');
    return this.http.patch(url,answer);
  }
  delete(id?: string) {
    const url = this.urls.getUrlAnswerDetail(id ?? 'error');
    return this.http.delete(url);
  }
}
