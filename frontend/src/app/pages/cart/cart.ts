import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule, PricePipe],   // ✅ use PricePipe here
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartPage {
  private cart = inject(CartService);

  items: CartItem[] = [];
  loading = true;

  get sessionId(): string {
    let sid = localStorage.getItem('sid');
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('sid', sid); }
    return sid;
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.cart.list({ sessionId: this.sessionId, status: 'open' })
      .subscribe({
        next: res => { this.items = res ?? []; this.loading = false; },
        error: () => { this.items = []; this.loading = false; }
      });
  }

  // helpers (prices stored in USD on server)
  toNum(v: string | number): number { return typeof v === 'number' ? v : parseFloat(v || '0'); }
  lineTotal(it: CartItem): number { return this.toNum(it.unitPrice) * it.quantity; }
  total(): number { return this.items.reduce((s,i)=> s + this.toNum(i.unitPrice)*i.quantity, 0); }

  inc(it: CartItem) { this.cart.update(it.id, { quantity: it.quantity + 1 }).subscribe(s => it.quantity = s.quantity); }
  dec(it: CartItem) { if (it.quantity <= 1) return; this.cart.update(it.id, { quantity: it.quantity - 1 }).subscribe(s => it.quantity = s.quantity); }
  remove(it: CartItem) { this.cart.remove(it.id).subscribe(() => this.items = this.items.filter(x => x.id !== it.id)); }
  clear() { this.cart.clear({ sessionId: this.sessionId }).subscribe(() => this.items = []); }

  checkoutWhatsApp() {
    if (!this.items.length) return;
    const phone = '905522808900';
    const lines = this.items.map(i => `• ${i.productName} x${i.quantity} — $${this.toNum(i.unitPrice).toFixed(2)}`).join('\n');
    const text = encodeURIComponent(`Hello, I want to order:\n${lines}\n\nTotal: $${this.total().toFixed(2)}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
