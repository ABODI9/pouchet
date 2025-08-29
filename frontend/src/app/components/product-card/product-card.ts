import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface Product {
  id: string | number;   // <-- كان number فقط
  name: string;
  price: number;
  image: string;
  rating: number;
  sold?: number;
  fav?: boolean;
  description?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  stars = Array(5).fill(0);
}
