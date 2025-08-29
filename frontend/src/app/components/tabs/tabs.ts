import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input()  active: HomeTab = 'filter';
  @Output() tabChange = new EventEmitter<HomeTab>();

  // نادِ هذه من الأزرار في القالب (tabs.html)
  select(tab: HomeTab) {
    if (this.active !== tab) {
      this.active = tab;
      this.tabChange.emit(tab);
    }
  }
}
