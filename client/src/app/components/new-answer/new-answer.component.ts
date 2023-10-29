import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Answer } from 'src/app/consts';
import { AnswerService } from 'src/app/services/answer.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-new-answer',
  templateUrl: './new-answer.component.html',
  styleUrls: ['./new-answer.component.scss']
})
export class NewAnswerComponent {
  @Input()
  answer?:Answer;
  @Output()
  public display: EventEmitter<boolean> = new EventEmitter();
  @Output()
  public created: EventEmitter<boolean> = new EventEmitter();
  modules = {};
  content = '';
  constructor(private arouter: ActivatedRoute,private auth:AuthenticationService,private ans:AnswerService) {
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
  addAnswer(content: string) {
    const topicId = this.arouter.snapshot.paramMap.get('topicId');
    const userId = this.auth.userValue?.id??'';
    const text = content;
    const answer :Answer= {
      topic: topicId??'',
      user: userId,
      text: text,
    };
    this.ans.create(answer).subscribe((v) => {
      this.display.emit(false);
      this.created.emit(true);
    });
  }
  hideForm() {
    this.display.emit(false);
  }
  addBindingCreated(quill: any){}
}
