import { Injectable } from '@angular/core';
import { UrlsService } from './urls.service';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../consts';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private urls:UrlsService, private http:HttpClient) { }
  list() {
    const url = this.urls.URL_COMMENTS_LIST;
    return this.http.get(url);
  }
  create(comment:Comment) {
    const url = this.urls.URL_COMMENTS_CREATE;
    return this.http.post(url, comment);
  }
  update(comment:Comment) {
    const url = this.urls.getUrlCommentDetail(comment.id??'error');
    return this.http.patch(url, comment);
  }
  delete(id?: string) {
    const url = this.urls.getUrlCommentDetail(id??'error');
    return this.http.delete(url);
  }
}
