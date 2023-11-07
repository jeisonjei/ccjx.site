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
  sortedData: any;
  constructor(
    private tagService:TagService
  ) { }
  ngOnInit(): void {
    this.refreshTags();
  }
  refreshTags() {
    this.tagService.listMyPrivate().subscribe((v: any) => {
      this.tags = v;
    })
  }
  sortData(event: any) {
    
  }
  deleteTag(tag: Tag) {
    const id = tag.id;
    this.tagService.delete(id ?? 'error').subscribe((v) => {
      this.refreshTags();
    });
  }
  
}
