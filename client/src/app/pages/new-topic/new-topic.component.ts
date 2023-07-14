import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { UrlsService } from '../../services/urls.service';
import { Topic as Topic } from '../../consts';
import { TopicService } from 'src/app/services/question.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Quill from 'quill';

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.scss'],
})
export class NewQuestionComponent implements OnInit {
  title: string='';
  topicId: string='';
  userId: string = '';
  modules = {};
  content = '';
  savedContent:SafeHtml='';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private urls: UrlsService,
    private quess: TopicService,
    private sanitizer:DomSanitizer
  ) {
    this.modules = {
      formula: true,
      syntax: true,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
    
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
    
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
    
        ['clean'],                                         // remove formatting button
    
        ['link', 'image', 'video'],                         // link and image, video
        ['formula']
      ]
    };
  }
  ngOnInit(): void {
    this.getTopic();
    this.selectTitle();
  }
  selectTitle() {
    const topic = document.getElementById('topic') as HTMLInputElement;
    topic?.focus();
  }
  getTopic() {
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    const topicId = this.activatedRoute.snapshot.paramMap.get('topicId');
    this.userId = userId??'';
    this.topicId = topicId??'';
    const url = this.urls.getUrlTopicDetail(topicId??'Error');
    const self = this;
    this.http.get(url).subscribe({
      next(value: any) {
        self.title = value.title != undefined ? value.title : 'Новый вопрос';
      },
    });
  }
  addQuestion(value: any) {
    const title = this.title;
    const text = this.content;
    const topicId = this.activatedRoute.snapshot.paramMap.get('topicId');
    const userId = this.activatedRoute.snapshot.paramMap.get('userId');
    const t: Topic = {
      user: userId??'Error',
      title: title,
      text: text,
    };
    const serverUrl = this.urls.getUrlTopicDetail(topicId??'Error');
    const self = this;
    this.http.patch(serverUrl, t).subscribe({
      next(value) {
        
      },
    }); 
    const url = `topics/${topicId}`;
    this.router.navigateByUrl(url);
  }
  cancel() {
    this.quess.delete(this.topicId??'').subscribe();
    this.router.navigateByUrl('');
  }
  handleTopicChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.title = value;
  }
  

  addBindingCreated(quill: Quill){}

}
