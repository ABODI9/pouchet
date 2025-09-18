import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../toast/toast.service';
import { UiProduct as UiProductModel } from '../../models/ui-product.model';
import { environment } from '../../../environments/environment';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink, PricePipe],
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
      unitPrice: String(this.product.price), // keep USD on server
      quantity: 1,
    }).subscribe({
      next: () => { this.cart.syncCount(); this.cart.syncItems(); this.toast?.show?.('Added to cart ✅', 'ok'); },
      error: () => this.toast?.show?.('Failed to add to cart', 'err'),
    });
  }

  buyNow() {
    if (!this.product) return;
    const phone = (environment as any).whatsappPhone || '966555555555';
    const url   = `${(environment as any).siteBaseUrl ?? ''}/product/${this.product.id}`;
    const text = encodeURIComponent(`Hello, I'm interested in:\n• ${this.product.name}\nLink: ${url}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
