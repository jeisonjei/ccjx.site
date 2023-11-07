import { Component, OnInit } from '@angular/core';
import { Tag } from '@app/consts';
import { TagService } from '@app/services/tag.service';

@Component({
  selector: 'app-my-tags',
  templateUrl: './my-tags.component.html',
  styleUrls: ['./my-tags.component.scss']
})
export class MyTagsComponent implements OnInit{
  tags: Tag[] = [];
  constructor(
    private tagService:TagService
  ) { }
  ngOnInit(): void {
    this.tagService.listMyPrivate().subscribe((v: any) => {
      this.tags = v;
      console.log(`🔥 tags: ${JSON.stringify(this.tags)}`);
    })
  }
  
}
