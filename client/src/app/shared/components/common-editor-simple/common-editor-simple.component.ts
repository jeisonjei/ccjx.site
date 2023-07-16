import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-common-editor-simple',
  templateUrl: './common-editor-simple.component.html',
  styleUrls: ['./common-editor-simple.component.scss']
})
export class CommonEditorSimpleComponent {
  @Input()
  content = '';
  @Output()
  onCancel: EventEmitter<any> = new EventEmitter();
  @Output()
  onSave: EventEmitter<any> = new EventEmitter();
  modules = {};
  constructor() {
    this.modules = {
      formula: true,
      syntax: true,
      imageResize:true,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        
       
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
       
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
    
        ['clean'],                                         // remove formatting button
    
        ['link'],                         // link and image, video
        ['formula']
      ]
    };
  }
  addBindingCreated(quill: any){}
}
