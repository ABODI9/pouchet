import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MiniCartService {
  openState = signal(false);
  open() {
    this.openState.set(true);
  }
  close() {
    this.openState.set(false);
  }
  toggle() {
    this.openState.update((v) => !v);
  }
}
