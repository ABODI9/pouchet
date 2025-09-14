// src/app/components/product-card/card.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../toast/toast.service';

export interface UiProduct {
  id: number | string;
  name: string;
  image?: string | null;
  price: number;
  rating?: number;
}

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  @Input() product!: UiProduct;

  private cart  = inject(CartService);
  private toast = inject(ToastService);

  addToCart() {
    if (!this.product) return;

    this.cart.add({
      productId: String(this.product.id),
      productName: this.product.name,
      productImage: this.product.image ?? null,
      unitPrice: String(this.product.price), // API يتوقع string
      quantity: 1,
    }).subscribe({
      next: () => {
        // حدّث البادج في الهيدر + أظهر توست
        this.cart.syncCount?.();              // لو موجودة في الخدمة
        this.toast.show('Added to cart ✅', 'ok');
      },
      error: () => this.toast.show('Failed to add to cart', 'err'),
    });
  }

  buyNow() {
    if (!this.product) return;

    // رقم واتساب من environment (يفضّل ضبطه كـ xxxxxxxxxxxxxxxx أثناء التطوير)
    const phone = environment.whatsappPhone || 'xxxxxxxxxxxxxxx';

    // رابط المنتج للرسالة
    const base = environment.siteBaseUrl?.replace(/\/$/, '') || '';
    const url  = `${base}/product/${this.product.id}`;

    const priceStr = Number(this.product.price).toFixed(2);
    const text = encodeURIComponent(
      `Hello, I want to buy:\n• ${this.product.name} — $${priceStr}\n\nProduct link: ${url}`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
