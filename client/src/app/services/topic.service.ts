import { Injectable } from '@angular/core';
import { Tag, Topic } from '../consts';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  listRecent(count:number) {
    const url = this.urls.getUrlTopicLast(count);
    return this.http.get(url);
  }
  listPopularArticles(count: number) {
    const url = this.urls.getUrlTopicPopularArticlesList(count);
    return this.http.get(url);
  }
  listNonAnswered(count: number) {
    const url = this.urls.getUrlTopicNonAnsweredList(count);
    return this.http.get(url);
  }
  listRecentByTag(count:number, tags: string[]) {
    const url = this.urls.getUrlTopicLast(count);
    let params = new HttpParams();
    for (const tag of tags) {
      params=params.append('tags',tag)
    }
    return this.http.get(url,{params:params});
  }
  listPopularArticlesByTag(count: number, tags: string[]) {
    const url = this.urls.getUrlTopicPopularArticlesList(count);
    let params = new HttpParams();
    for (const tag of tags) {
      params=params.append('tags', tag);
    }
    return this.http.get(url,{params:params});
  }
  listNonAnsweredByTag(count: number, tags: string[]) {
    const url = this.urls.getUrlTopicNonAnsweredList(count);
    let params = new HttpParams();
    for (const tag of tags) {
      params=params.append('tags',tag);
    }
    return this.http.get(url,{params:params});
  }
  create(topic: Topic):Observable<any>{
    const url=this.urls.getUrlTopicCreate(topic.user??'');
    return this.http.post(url, topic);
  }
  retrieve(id: string) {
    const url = this.urls.getUrlTopicDetail(id);
    return this.http.get(url);
  }
  update(id:string,topic: any) {
    const url = this.urls.getUrlTopicDetail(id ?? 'error');
    return this.http.patch(url,topic);
  }
  delete(id: string) {
    const url = this.urls.getQuestionDeleteUrl(id);
    return this.http.delete(url);
  }
}
