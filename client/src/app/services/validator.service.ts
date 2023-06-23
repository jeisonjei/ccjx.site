import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }
  text(value: string): boolean{
    const pattern = /(^ +$)|(^\d+$)|(^$)/g;
    if (value.match(pattern) != null) {
      return false;
    }
    if (value.length<10) {
      return false;
    }
    return true;
  }
}
