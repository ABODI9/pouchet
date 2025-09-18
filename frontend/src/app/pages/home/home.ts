// C:\Users\abodi\OneDrive\Desktop\pouchet\pouchet\frontend\src\app\pages\home\home.ts
import {
  Component, OnInit, inject, signal, computed, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsService, Product } from '../../services/products.service';
import { UiProduct as UiProductModel } from '../../models/ui-product.model';

import { Slider } from '../../components/slider/slider';
import { Tabs, HomeTab } from '../../components/tabs/tabs';
import { Card as ProductCard } from '../../components/product-card/card';

import { FeaturedService, FeaturedItem } from '../../services/featured.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Slider, Tabs, ProductCard],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  // Services
  private api = inject(ProductsService);
  private featuredApi = inject(FeaturedService);

  // Refs
  @ViewChild('row', { static: false }) row?: ElementRef<HTMLDivElement>;

  // State
  loading = signal<boolean>(false);
  error   = signal<string | null>(null);

  // All products in UI model
  all = signal<UiProductModel[]>([]);

  // ----- Top ONE-ROW strip -----
  /** Products shown in the horizontal strip (NOT affected by tabs). */
  stripProducts = computed(() => {
    // e.g. latest 10 items reversed for freshness
    return [...this.all()].slice(-10).reverse();
  });

  // ----- Tabs + full grid -----
  tab = signal<HomeTab>('filter'); // 'filter' | 'most' | 'fav'

  /** Products under the tabs (affected ONLY by the tabs). */
  gridProducts = computed(() => {
    let list = [...this.all()];
    switch (this.tab()) {
      case 'most':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'fav':
        return list.filter(p => (p.rating ?? 0) >= 4.5);
      default:
        return list; // 'filter' => show all (or keep your own baseline policy)
    }
  });

  // ----- Banners (four boxes section) -----
  banners = signal<FeaturedItem[]>([]);

  // Lifecycle
  ngOnInit() {
    this.fetchProducts();
    this.fetchBanners();
  }

  // Data fetching
  private fetchProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: res => {
        const ui = (res || []).map(p => this.toUi(p));
        this.all.set(ui);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products.');
        this.loading.set(false);
      }
    });
  }

  private fetchBanners() {
    this.featuredApi.list().subscribe({
      next: res => this.banners.set((res || []).slice(0, 4)),
      error: () => this.banners.set([]),
    });
  }

  // Mapping to UI model
  private toUi(p: Product): UiProductModel {
    return {
      id: String(p.id),
      name: p.title,
      image: p.imageUrl ?? null,
      price: Number(p.price || 0),
      rating: p.rating ?? null,
      description: p.description ?? null,
    };
  }

  // Tabs
  onTabChange(t: HomeTab) {
    this.tab.set(t);
  }

  // Horizontal row arrows
  private scrollBy(px: number) {
    this.row?.nativeElement.scrollBy({ left: px, behavior: 'smooth' });
  }
  next() { this.scrollBy(800); }
  prev() { this.scrollBy(-800); }

  // Footer year
  currentYear = new Date().getFullYear();
}
