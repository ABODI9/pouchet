import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMsg {
  text: string;
  kind?: 'ok' | 'warn' | 'err';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _q = new Subject<ToastMsg>();
  stream$ = this._q.asObservable();

  show(text: string, kind: ToastMsg['kind'] = 'ok') {
    this._q.next({ text, kind });
  }
}
