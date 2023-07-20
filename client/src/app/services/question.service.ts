import { Injectable } from '@angular/core';
import { Topic } from '../consts';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private http: HttpClient, private urls: UrlsService, private eh: ErrorHandlerService) { }
  list() {
    const url = this.urls.getUrlTopicCreate('');
    return this.http.get(url);

  }
  listShort() {
    const url = this.urls.getUrlTopicListShort();
    return this.http.get(url);
  }
  listShortMy() {
    const url = this.urls.getUrlTopicListMy();
    return this.http.get(url);
  }
  count() {
    const url = this.urls.getUrlTopicCount();
    return this.http.get(url);
  }
  lastList(amount:number) {
    const url = this.urls.getUrlTopicLast(amount);
    return this.http.get(url);
  }
  create(topic: Topic):Observable<any>{
    const url=this.urls.getUrlTopicCreate(topic.user??'');
    return this.http.post(url, topic);
  }
  retrieve(id: string) {
    const url = this.urls.getUrlTopicDetail(id);
    return this.http.get(url);
  }
  update(topic: Topic) {
    const url = this.urls.getUrlTopicDetail(topic.id ?? 'error');
    return this.http.patch(url,topic);
  }
  delete(id: string) {
    const url = this.urls.getQuestionDeleteUrl(id);
    return this.http.delete(url);
  }
}
