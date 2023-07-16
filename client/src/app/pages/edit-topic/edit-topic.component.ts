import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '@app/services/question.service';
import { UrlsService } from '@app/services/urls.service';
import { Topic } from "@app/consts";
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss'],
})
export class EditTopicComponent implements OnInit {
  title = '';
  userId = '';
  topicId = '';
  content = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private topicService: TopicService,
    private router: Router,
    private urls: UrlsService
  ) {}
  ngOnInit(): void {
    this.userId =
      this.activatedRoute.snapshot.paramMap.get('userId') ?? 'error';
    this.topicId =
      this.activatedRoute.snapshot.paramMap.get('topicId') ?? 'error';
    this.topicService.retrieve(this.topicId).subscribe((v: any) => {
      this.title = v.title;
      this.content = v.text;
    });
    
  }
  edit(content: string) {
    const topic: Topic = {
      id: this.topicId,
      user: this.userId,
      title: this.title,
      text: content,
    }
    this.topicService.update(topic).subscribe(() => {
      const url = `/topics/${this.topicId}`;
      this.router.navigateByUrl(url);
    });
  }
  cancel() {
    const url = `/topics/${this.topicId}`;
    this.router.navigateByUrl(url);
  }
  handleTopicChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.title = value;
  }
}
