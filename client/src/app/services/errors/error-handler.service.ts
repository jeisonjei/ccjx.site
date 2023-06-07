import { EventEmitter, Injectable, Output } from '@angular/core';
import { Consts, ServerError } from "../../consts";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  @Output() pubmEvent: EventEmitter<string> = new EventEmitter();
  c: Consts = new Consts();
  constructor() { }
  handleError(error: ServerError) {
    if (error.public) {
      const pubm = error.public;
      const privm = error.public;
      this.pubmEvent.emit(pubm)
      console.error(privm);
    }
    else {
      if (error.private) {
        const pubm=error.private;
        const privm = pubm;
        this.pubmEvent.emit(pubm);
        console.error(privm)    ;
      }
      else {
        const pubm = this.c.DEFAULT_ERROR_MESSAGE;
        const privm=JSON.stringify(error);
        this.pubmEvent.emit(pubm);
        console.error(privm);
      }
    }
  }

}
