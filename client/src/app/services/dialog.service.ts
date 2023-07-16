import { Injectable } from '@angular/core';
import { DelConfDial, MessDial } from '../consts';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PleaseRegisterComponent } from '../shared/dialogs/please-register/please-register.component';
import { DelConfComponent } from '@app/shared/dialogs/del-conf/del-conf.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:MatDialog) { }
  getMessDialData(title: string, message: string): MessDial {
    const messDial = {
      title: title,
      message: message
    };
    return messDial;
  }
  showMessDial(title: string, message: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.getMessDialData(title, message);
    this.dialog.open(PleaseRegisterComponent,dialogConfig);
  }
  getDelConDialData(title: string, message: string): DelConfDial{
    const delConfDialData = {
      title: title,
      message: message
    };
    return delConfDialData;
  }
  showDelConfDial(title: string, message: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.getDelConDialData(title, message);
    const dialogRef = this.dialog.open(DelConfComponent, dialogConfig);
    return dialogRef.afterClosed();
  }
}
