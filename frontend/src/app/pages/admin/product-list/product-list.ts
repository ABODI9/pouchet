import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
})
export class ProductList {
  private api = inject(ProductsService);
  loading = true;
  products: Product[] = [];
  error = '';

  ngOnInit() {
    this.api.list().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      },
    });
  }

  confirmDelete(p: Product) {
    if (!p?.id) return;
    if (!confirm(`Delete "${p.title}"?`)) return;

    this.api.remove(p.id).subscribe({
      next: () => (this.products = this.products.filter((x) => x.id !== p.id)),
      error: () => alert('Delete failed'),
    });
  }

  trackById = (_: number, p: Product) => p.id;
}
