import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Quill as Q } from "quill";
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
      imageResize: true,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    
    
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    
        
        ['link', 'image', 'video'],                         // link and image, video
        ['blockquote','code','code-block','formula'],
        ['clean'],                                         // remove formatting button
      ]
    };
  }
  addBindingCreated(quill: Q) {
    quill.keyboard.addBinding({ key: 'c', altKey: true } as any, (range, context) => {
      if (context.format.code) {
        quill.format('code',false);
      }
      else {
        quill.format('code', true);
      }
    });
    quill.keyboard.addBinding({ key: 'm', ctrlKey: true } as any, (range, context) => {
      if (quill.getFormat(range)['font'] === 'monospace') {
        quill.format('font', '');
      }
      else {
        quill.format('font', 'monospace');
      }
    });
  }
}
