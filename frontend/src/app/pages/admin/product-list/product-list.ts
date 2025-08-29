import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, Product as ApiProduct } from '../../../services/products.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
})
export class ProductList {
  private api = inject(ProductsService);
  items: ApiProduct[] = [];
  loading = true;

  ngOnInit() {
    this.api.list().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
