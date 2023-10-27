import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Renderer2 } from '@angular/core';
import * as Editor from '@src/assets/ckeditor';


@Component({
  selector: 'app-common-editor-rich',
  templateUrl: './common-editor-rich.component.html',
  styleUrls: ['./common-editor-rich.component.scss']
})
export class CommonEditorRichComponent implements OnInit,OnChanges{
  @Input()
  content = '';
  @Output()
  onCancel: EventEmitter<any> = new EventEmitter();
  @Output()
  onSave: EventEmitter<any> = new EventEmitter();
  public Editor = Editor;
  public model = {
    editorData: ''
  };
  constructor(private renderer:Renderer2) {
  }
  ngOnInit(): void {
    
  }
  ngOnChanges(changes: any) {
    if (changes.content) {
      this.model.editorData = this.content;
    }
  }
  save() {
    this.content = this.model.editorData;
    this.onSave.emit(this.content);
  }
}
