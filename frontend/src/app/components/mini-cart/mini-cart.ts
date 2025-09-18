import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MiniCartService } from '../../services/mini-cart.service';
import { CartService } from '../../services/cart.service';
import { PricePipe } from '../../pipes/price.pipe';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

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

  close(){ this.mini.close(); }

  async checkoutWhatsApp(){
    const items = await firstValueFrom(this.items$);
    if (!items?.length) return;
    const phone = (environment as any).whatsappPhone || '966555555555';
    const lines = items.map(i => `• ${i.productName} x${i.quantity} — ${i.unitPrice}`).join('\n');
    const total = items.reduce((s,i)=> s + (parseFloat(i.unitPrice||'0') * (i.quantity||0)), 0);
    const text = encodeURIComponent(`Hello, I want to order:\n${lines}\n\nTotal: $${total.toFixed(2)} (USD base)`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
