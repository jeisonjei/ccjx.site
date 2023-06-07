import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-waiting-button',
  templateUrl: './waiting-button.component.html',
  styleUrls: ['./waiting-button.component.scss']
})
export class WaitingButtonComponent {
  @Input() waiting: boolean = false
  @Input() title: string = '';
}
