import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);


@Component({
  selector: 'app-common-editor-rich',
  templateUrl: './common-editor-rich.component.html',
  styleUrls: ['./common-editor-rich.component.scss']
})
export class CommonEditorRichComponent {
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
  addBindingCreated(quill: any){}
}
