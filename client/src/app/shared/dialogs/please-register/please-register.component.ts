import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-please-register',
  templateUrl: './please-register.component.html',
  styleUrls: ['./please-register.component.scss']
})
export class PleaseRegisterComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,dialogRef:MatDialogRef<PleaseRegisterComponent>) { }
}
