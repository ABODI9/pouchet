import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  public auth = inject(AuthService);
  // استخدام واحد للـ user$ في القالب لتفادي تكرار async
  user$ = this.auth.user$;

  // واجهة بسيطة للقائمة المنسدلة + قائمة الموبايل
  menuOpen = signal(false);
  mobileOpen = signal(false);

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }
  toggleMobile() { this.mobileOpen.update(v => !v); }

  logout() {
    this.auth.logout();
    this.closeMenu();
  }

  initial(email?: string | null) {
    if (!email) return 'U';
    const c = email.trim()[0] ?? 'U';
    return c.toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    // اغلق القائمة لو النقر خارج الأفاتار/القائمة
    if (!target.closest('.userbox')) this.closeMenu();
  }
}
