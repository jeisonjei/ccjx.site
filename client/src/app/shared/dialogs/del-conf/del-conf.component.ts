import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-del-conf',
  templateUrl: './del-conf.component.html',
  styleUrls: ['./del-conf.component.scss']
})
export class DelConfComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data,private dialogRef: MatDialogRef<DelConfComponent>) { }
  del() {
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
