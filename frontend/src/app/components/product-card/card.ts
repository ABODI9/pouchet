import { Component, Input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../toast/toast.service';
import { UiProduct as UiProductModel } from '../../models/ui-product.model'; // ← الموديل الموحّد

// ✅ إعادة تصدير النوع من نفس الموديل (حتى لو فيه أكواد تستورده من الكارد ما تنكسر)
export type UiProduct = UiProductModel;

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  @Input({ required: true }) product!: UiProductModel;

  private cart  = inject(CartService);
  private toast = inject(ToastService);

  addToCart() {
    if (!this.product) return;

    this.cart.add({
      productId: String(this.product.id),
      productName: this.product.name,
      productImage: this.product.image ?? null,
      unitPrice: String(this.product.price),
      quantity: 1,
    }).subscribe({
      next: () => {
        (this.cart as any).syncCount?.();
        this.toast?.show?.('Added to cart ✅', 'ok');
      },
      error: () => this.toast?.show?.('Failed to add to cart', 'err'),
    });
  }

  buyNow() {
    if (!this.product) return;

    const phone = environment.whatsappPhone || '905522808900';
    const base  = (environment.siteBaseUrl ?? '').replace(/\/$/, '');
    const url   = `${base}/product/${this.product.id}`;

    const text = encodeURIComponent(
      `Hello, I want to buy:\n• ${this.product.name} — $${Number(this.product.price).toFixed(2)}\n\nProduct link: ${url}`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
