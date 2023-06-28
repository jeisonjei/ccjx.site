import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Answer, Comment, Question, User } from 'src/app/consts';
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
  addComment(form: NgForm) {
    const type = this.relatedItem?.type;
    const relId = this.relatedItem?.id;
    if (type=='question') {
      const comm:Comment = {
        user: this.auth.cu?.id ?? '',
        question: relId,
        text: form.value.text
      }
      this.coms.create(comm).subscribe(() => {
        this.created.emit(true);
        this.display.emit(false);
      });
    }
    else if (type=='answer') {
      const comm: Comment = {
        user: this.auth.cu?.id ?? '',
        answer:relId,
        text:form.value.text
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
