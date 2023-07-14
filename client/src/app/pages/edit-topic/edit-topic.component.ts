import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss']
})
export class EditTopicComponent implements OnInit{
  userId = '';
  topicId = '';
  content = '';
  constructor(private activatedRoute: ActivatedRoute) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId')??'error';
    this.topicId = this.activatedRoute.snapshot.paramMap.get('topicId') ?? 'error';
   }
  ngOnInit(): void {
    
  }
}
