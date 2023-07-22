import { Injectable } from '@angular/core';
import { UrlsService } from '@app/services/urls.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private http: HttpClient, private urls: UrlsService) { }
  list(){
	  const url = this.urls.getUrlVoteList();
	  return this.http.get(url).pipe(
		  map((v:any) => {
			 return v.reduce((x,y) => x.score + y.score); 
		  })
	  )

  }
  create(vote: any){
	  const url = this.urls.getUrlVoteCreate();
	  return this.http.post(url, vote);
  }
}
