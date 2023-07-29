import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from '@app/services/urls.service';
import { Tag } from '@app/consts';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private urls:UrlsService, private http: HttpClient) { }
  list() {
    const url = this.urls.getUrlTagList();
    return this.http.get(url);
  }
  create(tag: Tag) {
    const url = this.urls.getUrlTagCreate();
    return this.http.post(url,tag);
  }
  retrieve(id: string) {
    const url = this.urls.getUrlTagRetrieve(id);
    return this.http.get(url);
  }
  update(id: string, tag: any) {
    const url = this.urls.getUrlTagUpdate(id);
    return this.http.patch(url,tag) ;
  }
  updateMany(tags:any[]) {
    return from(tags).subscribe(v => {
      this.update(v.id, v).subscribe();
    });
  }
  deleteFromTopic(id:string,tag: any) {
    const url = this.urls.getUrlTagUpdate(id);
    return this.http.patch(url,tag);
  }
}
