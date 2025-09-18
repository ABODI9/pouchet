import { Component, OnInit, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
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
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private api = inject(ProductsService);
  private featuredApi = inject(FeaturedService);

  @ViewChild('row', { static: false }) row?: ElementRef<HTMLDivElement>;

  loading = signal<boolean>(false);
  error   = signal<string | null>(null);

  all = signal<UiProductModel[]>([]);
  tab = signal<HomeTab>('filter');

  // بنرات ثنائية أسفل الشريط
  banners = signal<FeaturedItem[]>([]);

  filtered = computed(() => {
    const list = this.all();
    switch (this.tab()) {
      case 'most': return [...list].sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'fav':  return list.filter(p => (p.rating ?? 0) >= 4.5);
      default:     return [...list].reverse();
    }
  });

  ngOnInit() {
    this.load();
    this.featuredApi.list().subscribe({
      next: (res) => this.banners.set((res || []).slice(0,2)),
      error: () => this.banners.set([]),
    });
  }

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

  private load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (res) => { this.all.set((res || []).map(p => this.toUi(p))); this.loading.set(false); },
      error: () => { this.error.set('Failed to load products.'); this.loading.set(false); }
    });
  }

  onTabChange(t: HomeTab) { this.tab.set(t); }

  // أسهم الشريط
  scrollBy(px:number){ this.row?.nativeElement.scrollBy({ left: px, behavior: 'smooth' }); }
  next(){ this.scrollBy(800); }
  prev(){ this.scrollBy(-800); }

    currentYear = new Date().getFullYear();
}
