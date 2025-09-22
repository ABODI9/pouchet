import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MiniCartService } from '../../services/mini-cart.service';
import { CurrencyService, CurrencyCode } from '../../services/currency.service';
import { AuthService } from '../../services/auth.service';
import { MiniCart } from '../mini-cart/mini-cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MiniCart],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit {
  private cart = inject(CartService);
  private mini = inject(MiniCartService);
  private cur = inject(CurrencyService);
  private auth = inject(AuthService);

  count$ = this.cart.count$;
  code = this.cur.code;

  user$ = this.auth.user$;
  menuOpen = signal(false);
  currOpen = signal(false);

  ngOnInit() {
    this.cart.syncCount();
    this.cart.syncItems();
    // If your AuthService exposes a restore method, call it here.
    // Otherwise user$ should already reflect the current session.
  }

  openMiniCart() {
    this.mini.open();
  }
  toggleCurrencies() {
    this.currOpen.update((v) => !v);
  }
  setCurrency(c: CurrencyCode) {
    this.cur.set(c);
    this.currOpen.set(false);
  }
  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }
  closeMenu() {
    this.menuOpen.set(false);
  }
  logout() {
    this.auth.logout();
    this.closeMenu();
  }
  initial(email?: string | null) {
    return (email?.trim()?.[0] ?? 'U').toUpperCase();
  }
}
