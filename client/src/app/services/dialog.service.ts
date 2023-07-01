import { Injectable } from '@angular/core';
import { MessDial } from '../consts';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PleaseRegisterComponent } from '../shared/dialogs/please-register/please-register.component';

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
}
