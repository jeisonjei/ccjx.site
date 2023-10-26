import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Renderer2 } from '@angular/core';


@Component({
  selector: 'app-common-editor-rich',
  templateUrl: './common-editor-rich.component.html',
  styleUrls: ['./common-editor-rich.component.scss']
})
export class CommonEditorRichComponent implements OnInit{
  @Input()
  content = '';
  @Output()
  onCancel: EventEmitter<any> = new EventEmitter();
  @Output()
  onSave: EventEmitter<any> = new EventEmitter();
  constructor(private renderer:Renderer2) {
  }
  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/bundle.js';
    this.renderer.appendChild(document.head,script);

  }
}
