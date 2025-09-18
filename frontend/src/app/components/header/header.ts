import { Component, HostListener, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit {
  // Auth
  public auth = inject(AuthService);
  user$ = this.auth.user$;

  // Cart
  private cartSvc = inject(CartService);
  count$ = this.cartSvc.count$;

  // قوائم
  menuOpen = signal(false);
  mobileOpen = signal(false);

  ngOnInit() { this.cartSvc.syncCount(); }
  toggleMenu()  { this.menuOpen.update(v => !v); }
  closeMenu()   { this.menuOpen.set(false); }
  toggleMobile(){ this.mobileOpen.update(v => !v); }

  logout(){ this.auth.logout(); this.closeMenu(); }
  initial(email?: string | null){ return (email?.trim()?.[0] ?? 'U').toUpperCase(); }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const t = ev.target as HTMLElement;
    if (!t.closest('.userbox')) this.closeMenu();
  }
}
