import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UiProduct as UiProductModel } from '../../models/ui-product.model';

@Component({
  selector: 'app-quick-view',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './quick-view.html',
  styleUrls: ['./quick-view.scss'],
})
export class QuickView {
  @Input() product: UiProductModel | null = null;
  @Output() close = new EventEmitter<void>();
}
