import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product as ApiProduct } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
})
export class ProductDetailPage {
  private route = inject(ActivatedRoute);
  private api   = inject(ProductsService);
  private cart  = inject(CartService);

  loading = true;
  error   = '';
  product?: {
    id: string;
    name: string;
    image?: string | null;
    price: number;
    rating?: number | null;
    description?: string | null;
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('[product-detail] id =', id);

    // ✅ حارس مبكر — يوقف NaN أو عدم وجود id
    if (!id || id === 'NaN') {
      this.error = 'Invalid product id';
      this.loading = false;
      return;
    }

    this.api.getOne(id).subscribe({
      next: (p: ApiProduct) => {
        this.product = {
          id: String(p.id),
          name: p.title,
          image: p.imageUrl ?? null,
          price: Number(p.price ?? 0),
          rating: p.rating ?? null,
          description: (p as any).description ?? null,
        };
        this.loading = false;
      },
      error: () => { this.error = 'Product not found'; this.loading = false; }
    });
  }

  addToCart() {
    if (!this.product) return;
    this.cart.add({
      productId: this.product.id,
      productName: this.product.name,
      productImage: this.product.image ?? null,
      unitPrice: String(this.product.price),
      quantity: 1,
    }).subscribe({
      next: () => {
        (this.cart as any).syncCount?.();
        // يمكن استبدال التنبيه بتوست إن وُجد
        // this.toast.show('Added to cart ✅', 'ok');
      },
      error: () => {
        // this.toast.show('Failed to add to cart', 'err');
        alert('Failed to add to cart');
      },
    });
  }

  buyNow() {
    if (!this.product) return;
    const phone = environment.whatsappPhone || '905522808900';
    const base  = (environment.siteBaseUrl ?? '').replace(/\/$/, '');
    const url   = `${base}/product/${this.product.id}`;
    const text  = encodeURIComponent(
      `Hello, I want to buy:\n• ${this.product.name} — $${this.product.price.toFixed(2)}\n\nProduct link: ${url}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
