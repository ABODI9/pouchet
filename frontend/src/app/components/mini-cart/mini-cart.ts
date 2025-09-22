import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MiniCartService } from '../../services/mini-cart.service';
import { CartService, CartItem } from '../../services/cart.service';
import { PricePipe } from '../../pipes/price.pipe';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe],
  templateUrl: './mini-cart.html',
  styleUrls: ['./mini-cart.scss'],
})
export class MiniCart {
  private mini = inject(MiniCartService);
  private cart = inject(CartService);

  open = this.mini.openState;
  items$ = this.cart.items$;

  // نُظهر التغييرات فورًا باستخدام Map محلية
  private quantities = new Map<string, number>();
  private sub?: Subscription;

  constructor() {
    this.sub = (this.items$ as any).subscribe((items: CartItem[] = []) => {
      const seen = new Set<string>();
      for (const it of items) {
        seen.add(it.id);
        if (!this.quantities.has(it.id)) {
          this.quantities.set(it.id, Math.max(1, it.quantity ?? 1));
        }
      }
      for (const k of Array.from(this.quantities.keys())) {
        if (!seen.has(k)) this.quantities.delete(k);
      }
    });
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  close() {
    this.mini.close();
  }

  private toNumber(v: any): number {
    const n =
      typeof v === 'number'
        ? v
        : parseFloat((v || '0').toString().replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  qty(it: CartItem): number {
    return this.quantities.get(it.id) ?? it.quantity ?? 1;
  }

  // زيادة
  inc(it: CartItem) {
    const newQ = this.qty(it) + 1;
    this.quantities.set(it.id, newQ); // UI فوري
    this.cart.update(it.id, { quantity: newQ }).subscribe(); // يحدث الخادم + يزامن
  }

  // نقصان: لو صارت 0 نحذف (صغير وأساسي)
  dec(it: CartItem) {
    const newQ = this.qty(it) - 1;
    if (newQ <= 0) {
      this.quantities.set(it.id, 0); // إخفاء فوري
      this.cart.remove(it.id).subscribe(); // حذف من الخادم
      return;
    }
    this.quantities.set(it.id, newQ);
    this.cart.update(it.id, { quantity: newQ }).subscribe();
  }

  // زر ✕
  remove(it: CartItem) {
    this.quantities.set(it.id, 0); // إخفاء فوري
    this.cart.remove(it.id).subscribe();
  }

  async checkoutWhatsApp() {
    const items = await firstValueFrom(this.items$);
    if (!items?.length) return;
    const phone = (environment as any).whatsappPhone || '966555555555';
    const lines = items
      .map((i) => `• ${i.productName} x${this.qty(i)} — ${i.unitPrice}`)
      .join('\n');
    const total = items.reduce(
      (s, i) => s + this.toNumber(i.unitPrice) * this.qty(i),
      0,
    );
    const text = encodeURIComponent(
      `Hello, I want to order:\n${lines}\n\nTotal: $${total.toFixed(2)} (USD base)`,
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
