import { Component, Input, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';            // 👈 جديد
import { CartService } from '../../services/cart.service';
import { ToastService } from '../toast/toast.service';
import { UiProduct as UiProductModel } from '../../models/ui-product.model';
import { environment } from '../../../environments/environment';

export type UiProduct = UiProductModel;

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, CurrencyPipe, RouterLink],     // 👈 أضف RouterLink هنا
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
      next: () => { (this.cart as any).syncCount?.(); this.toast?.show?.('Added to cart ✅', 'ok'); },
      error: () => this.toast?.show?.('Failed to add to cart', 'err'),
    });
  }

  buyNow() {
    if (!this.product) return;
    const phone = environment.whatsappPhone || '966555555555';
    const base  = (environment.siteBaseUrl ?? '').replace(/\/$/, '');
    const url   = `${base}/product/${this.product.id}`;
    const sar = new Intl.NumberFormat('ar-SA',{style:'currency',currency:'SAR'}).format(this.product.price);
    const text = encodeURIComponent(`مرحباً، أرغب بشراء:\n• ${this.product.name} — ${sar}\nرابط المنتج: ${url}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
