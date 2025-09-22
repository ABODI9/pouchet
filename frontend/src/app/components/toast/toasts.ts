import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { ToastService, ToastMsg } from './toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="toasts">
    <div
      class="toast"
      *ngFor="let t of list"
      [class.ok]="t.kind === 'ok'"
      [class.err]="t.kind === 'err'"
      [class.warn]="t.kind === 'warn'"
    >
      {{ t.text }}
    </div>
  </div>`,
  styles: [
    `
      .toasts {
        position: fixed;
        right: 16px;
        bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
      }
      .toast {
        background: #0b1220;
        color: #eaf2ff;
        border: 1px solid #1d2939;
        padding: 10px 12px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(2, 6, 23, 0.32);
      }
      .toast.ok {
        border-color: #2dd4bf;
      }
      .toast.warn {
        border-color: #f59e0b;
      }
      .toast.err {
        border-color: #ef4444;
      }
    `,
  ],
})
export class Toasts implements OnDestroy {
  private toast = inject(ToastService);

  list: ToastMsg[] = [];
  sub: Subscription;

  constructor() {
    this.sub = this.toast.stream$.subscribe((t) => {
      this.list.push(t);
      timer(2200).subscribe(() => this.list.shift());
    });
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
