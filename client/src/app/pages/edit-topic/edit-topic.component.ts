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
  modules = {};
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
    this.modules = {
      formula: true,
      syntax: true,
      imageResize:true,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button

        ['link', 'image', 'video'], // link and image, video
        ['formula'],
      ],
    };
  }
  edit(form: NgForm) {
    const topic: Topic = {
      id: this.topicId,
      user: this.userId,
      title: this.title,
      text: this.content,
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
  addBindingCreated(quill: any) {}
}
