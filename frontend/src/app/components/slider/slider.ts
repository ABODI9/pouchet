import { Component, OnDestroy, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeaturedService, FeaturedItem } from '../../services/featured.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
})
export class Slider implements OnInit, OnDestroy {
  private api = inject(FeaturedService);

  banners: FeaturedItem[] = [];
  i = 0;

  private timer: any = null;
  private sub?: Subscription;

  intervalMs = 5000;
  hovering = false;
  touchStartX = 0;
  reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngOnInit() {
    this.load();
    this.sub = this.api.updated$.subscribe(() => this.load());
  }

  private load() {
    this.api.list().subscribe({
      next: (res) => {
        this.banners = (res || [])
          .filter(b => b.active)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.i = 0;
        this.startAuto();
      },
      error: () => { this.banners = []; }
    });
  }

  startAuto() {
    this.stopAuto();
    if (this.reduceMotion) return;
    if (this.banners.length > 1 && !this.hovering) {
      this.timer = setInterval(() => this.next(), this.intervalMs);
    }
  }
  stopAuto() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
  pause()  { this.hovering = true;  this.stopAuto(); }
  resume() { this.hovering = false; this.startAuto(); }

  prev() { if (this.banners.length) this.i = (this.i + this.banners.length - 1) % this.banners.length; }
  next() { if (this.banners.length) this.i = (this.i + 1) % this.banners.length; }
  go(k: number) { this.i = k % (this.banners.length || 1); this.startAuto(); }

  onTouchStart(e: TouchEvent) { this.touchStartX = e.changedTouches[0].clientX; }
  onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(dx) > 40) (dx > 0 ? this.prev() : this.next());
    this.startAuto();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.banners.length) return;
    if (e.key === 'ArrowLeft')  { this.prev(); this.startAuto(); }
    if (e.key === 'ArrowRight') { this.next(); this.startAuto(); }
  }

  // استخدمها فقط عندما يوجد productId
  linkTo(b: FeaturedItem) {
    return b.productId ? ['/product', b.productId] : undefined;
  }

  trackById = (_: number, b: FeaturedItem) => b.id;

  ngOnDestroy() { this.stopAuto(); this.sub?.unsubscribe(); }
}
