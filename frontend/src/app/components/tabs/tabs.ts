import { Component, EventEmitter, Input, Output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HomeTab = 'filter' | 'most' | 'fav';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.scss']
})
export class Tabs {
  /** currently active tab (controlled by parent) */
  @Input() active: HomeTab = 'filter';
  /** fires when user chooses another tab */
  @Output() tabChange = new EventEmitter<HomeTab>();

  // keep an internal signal just for keyboard focus ring and quick comparisons
  current = signal<HomeTab>(this.active);
  constructor() {
    effect(() => this.current.set(this.active));
  }

  tabs: { key: HomeTab; label: string }[] = [
    { key: 'filter', label: 'Filter' },
    { key: 'most',   label: 'Best Sellers' },
    { key: 'fav',    label: 'Favorites' },
  ];

  setTab(key: HomeTab) {
    if (key !== this.active) this.tabChange.emit(key);
  }

  // Arrow key navigation
  onKey(e: KeyboardEvent) {
    const order: HomeTab[] = ['filter', 'most', 'fav'];
    const idx = order.indexOf(this.active);
    if (e.key === 'ArrowLeft')  { this.setTab(order[(idx + order.length - 1) % order.length]); }
    if (e.key === 'ArrowRight') { this.setTab(order[(idx + 1) % order.length]); }
  }
}
