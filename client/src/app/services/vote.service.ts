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
		  map(v => {
			  let sum = 0;
			  for(let vote of v){
				  sum = sum + vote.score;
			  }
			  return sum;
		  })
	  )

  }
  create(vote: any){
	  const url = this.urls.getUrlVoteCreate();
	  return this.http.post(url, vote);
  }
}
