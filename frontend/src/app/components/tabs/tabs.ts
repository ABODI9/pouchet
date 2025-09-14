import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HomeTab = 'filter' | 'most' | 'fav';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs">
      <button [class.active]="active==='filter'" (click)="set('filter')">Filter</button>
      <button [class.active]="active==='most'"   (click)="set('most')">The Most Sells</button>
      <button [class.active]="active==='fav'"    (click)="set('fav')">Favorite</button>
    </div>
  `,
  styles: [`
    .tabs { display: flex; gap: .5rem; margin: 1rem 0; }
    .tabs button { padding: .5rem .9rem; border-radius: 8px; border: 1px solid rgba(255,255,255,.1); background: transparent; color: #fff; }
    .tabs button.active { background: #2563eb; border-color: #2563eb; }
  `]
})
export class Tabs {
  @Input() active: HomeTab = 'filter';
  @Output() tabChange = new EventEmitter<HomeTab>();
  set(t: HomeTab) { this.active = t; this.tabChange.emit(t); }
}
