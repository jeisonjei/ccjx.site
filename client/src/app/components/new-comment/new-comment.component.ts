import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Answer, Comment, Topic, User } from 'src/app/consts';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommentService } from 'src/app/services/comment.service';
import { UrlsService } from 'src/app/services/urls.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss']
})
export class NewCommentComponent implements OnInit{
  @Input()
  relatedItem?: any;
  @Output()
  display: EventEmitter<boolean> = new EventEmitter();
  @Output()
  created: EventEmitter<boolean> = new EventEmitter();
  constructor(private coms:CommentService,private aroute:ActivatedRoute,private http:HttpClient,private urls:UrlsService,private auth:AuthenticationService) { }
  ngOnInit(): void {
    
    
  }
  addComment(content:string) {
    const type = this.relatedItem?.type;
    const relId = this.relatedItem?.id;
    if (type=='question') {
      const comm:Comment = {
        user: this.auth.userValue?.id ?? '',
        topic: relId,
        text: content
      }
      this.coms.create(comm).subscribe(() => {
        this.created.emit(true);
        this.display.emit(false);
      });
    }
    else if (type=='answer') {
      const comm: Comment = {
        user: this.auth.userValue?.id ?? '',
        answer:relId,
        text:content
      }
      this.coms.create(comm).subscribe(() => {
        this.created.emit(true);
        this.display.emit(false);
      });
    }
  }
  hideForm() {
    this.display.emit(false);
  }
}
